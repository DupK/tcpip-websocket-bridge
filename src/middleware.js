const app = require('express')();
const server = require('http').Server(app);
const net = require('net');
const io = require('socket.io')(server);
const client = new net.Socket();
const parser = require('./parser');
const commands = require('./commands');

server.listen(8080);
io.on('connect', function (socket) {
    socket.on('bridge', function (data) {
      client.connect(data.port, data.ip,  function () {
          console.log('[Connected to ' + data.ip + ':' + data.port + ']');
      });
  });

  var state = {
    mapSize: {},
    players: {},
    cells: {},
  };

  function setState(data) {
    state = Object.assign({}, state, data);
  }

  const protocol = {
    msz: (data) => commands.msz(data, state),
    bct: (data, socket) => commands.bct(data, socket, state),
    pnw: (data, socket) => commands.pnw(data, socket, state),
    ppo: (data, socket) => commands.ppo(data, socket, state),
    plv: (data, socket) => commands.plv(data, socket, state),
    pin: (data, socket) => commands.pin(data, socket, state),
    pic: (data, socket) => commands.pic(data, socket, state),
    pie: (data, socket) => commands.pie(data, socket, state),
    pdi: (data, socket) => commands.pdi(data, socket, state),
    enw: (data, socket) => commands.enw(data, socket, state),
    seg: (data, socket) => commands.seg(data, socket),
  };

  var hasLoadedPayload = false;
  var payloadBuffer = "";
  var payloadSize = -1;

  client.on('data', function (raw) {
    const data = raw.toString('ascii');
    const [ tmp_cmd ] = data.split(' ');
    const commands = data.split('\n');

    if (data === 'WELCOME\n')
      client.write('GRAPHIC\n');
    else if (!hasLoadedPayload) {
      if (tmp_cmd === 'msz') {
        setState(protocol[tmp_cmd](data, state))
        payloadSize = (state.mapSize.width * state.mapSize.height) + 2;
      }
      payloadBuffer += data;
      if (parser.translate(payloadBuffer).length > payloadSize) {
        const payloadProcessed = parser.payloadProcessing(payloadBuffer, state);
        setState(payloadProcessed);
        socket.emit('initialization', payloadProcessed);
        hasLoadedPayload = true;
      }
    }
    else {
        commands.forEach(function (command) {
            const [ cmd ] = command.split(' ');
              if (protocol[cmd])
                setState(protocol[cmd](command, socket))
         });
      }
    });

  client.on('close', function () {
    socket.emit('failed');
    socket.disconnect();
  });

  client.on('error', function(e) {
    socket.emit('failed');
    socket.disconnect();
  })

  socket.on('error', function (e) {
    socket.emit('failed');
    socket.disonnect();
  })

  socket.on('close', function (e) {
    socket.emit('failed');
    socket.disonnect();
  })

});
