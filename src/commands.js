var _ = require('lodash');

module.exports = {

  msz: (data, state) => {
    const [ ,width, height ] = data.split(' ');
    return { mapSize: { width: parseInt(width, 10), height: parseInt(height, 10) } };
  },

  bct: function bctProcessing(data, socket, state) {
    const { mapSize, cells } = state;
    const [, x, y, life, linemate, deraumere, sibur, mendiane, phiras, thystame] = data.split(" ");
    const id = parseInt(x, 10) * parseInt(mapSize.width, 10) + parseInt(y, 10);
    const ret = {
      cells: Object.assign({}, cells, {
        [id]: Object.assign({}, cells[id], {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          life: parseInt(life, 10),
          resources: [
            parseInt(linemate, 10),
            parseInt(deraumere, 10),
            parseInt(sibur, 10),
            parseInt(mendiane, 10),
            parseInt(phiras, 10),
            parseInt(thystame, 10),
          ],
        })
      })
    }
    socket.emit('cells', ret.cells);
    return ret;
  },

  pdi: function pdiProcessing(data, socket, state) {
    const { players } = state;
    const [, id] = data.split(' ');
    const idProcessed = id.split('\n');
    delete(players[idProcessed[0]]);
    const ret = { players: Object.assign({}, players) };
    socket.emit('players', ret.players);
    return ret;
  },

  pnw: function pnwProcessing(data, socket, state) {
    const { players } = state;
    const [, id, x, y, orientation, level, teamName ] = data.split(' ');
    const [ team ] = teamName.split('\n');
    const ret = {
      players: Object.assign({}, players, {
        [id]: Object.assign({}, players[id], {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          orientation: parseInt(orientation, 10),
          level: parseInt(level, 10),
          teamName: team,
          life: 10,
          resources: [
            0, 0, 0, 0, 0, 0
          ]
        }),
      }),
    };
    socket.emit('players', ret.players);
    return ret;
  },

  ppo: function ppoProcessing(data, socket, state) {
    const { players } = state;
    const [ ,id, x, y, orientation ] = data.split(' ');

    const ret = {
      players: Object.assign({}, players, {
        [id]: Object.assign({}, players[id], {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          orientation: parseInt(orientation, 10),
        }),
      }),
    };
    socket.emit('players', ret.players);
    return ret;
  },

  plv: function plvProcessing(data, socket, state) {
    const { players } = state;
    const [ , id, level] = data.split(' ');

    const ret = {
      players: Object.assign({}, players, {
        [id]: Object.assign({}, players[id], {
          level: parseInt(level, 10),
        }),
      }),
    };
    socket.emit('players', ret.players);
    return ret;
  },

  pin: function pinProcessing(data, socket, state) {
    const { players } = state;
    const [ , id, x, y, life, linemate, deraumere, sibur, mendiane, phiras, thystame] = data.split(' ');

    const ret = {
      players: Object.assign({}, players, {
        [id]: Object.assign({}, players[id], {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          life: parseInt(life, 10),
          resources: [
            parseInt(linemate, 10),
            parseInt(deraumere, 10),
            parseInt(sibur, 10),
            parseInt(mendiane, 10),
            parseInt(phiras, 10),
            parseInt(thystame, 10),
          ]
        }),
      }),
    };
    socket.emit('players', ret.players);
    return ret;
  },

  pbc: function pbcProcessing(data, socket) {
    const preProcessing = data.split(' ');
    socket.emit('message', preProcessing[2])
  },

  pic: function picProcessing(data, socket, state) {
    const { mapSize, cells } = state;
    const [ , x, y, level] = data.split(' ');
    const id = parseInt(x, 10) * parseInt(mapSize.width, 10) + parseInt(y, 10);
    const ret = {
      cells: Object.assign({}, cells, {
        [id]: Object.assign({}, cells[id], {
          incant: 1,
        }),
      }),
    };
    socket.emit('cells', ret.cells);
    return ret;
  },

  pie: function pieProcessing(data, socket, state) {
    const { mapSize, cells } = state;
    const [ , x, y, result] = data.split(' ');
    const id = parseInt(x, 10) * parseInt(mapSize.width, 10) + parseInt(y, 10);
    const ret = {
      cells: Object.assign({}, cells, {
        [id]: Object.assign({}, cells[id], {
          incant: 0,
          result: result,
        }),
      }),
    };
    socket.emit('cells', ret.cells);
    return ret;
  },

  enw: function enwProcessing(data, socket, state) {
    const { mapSize, cells } = state;
    const [ , eggId, playerId, x, y] = data.split(' ');
    const id = parseInt(x, 10) * parseInt(mapSize.width, 10) + parseInt(y, 10);
    const ret = {
      cells: Object.assign({}, cells, {
        [id]: Object.assign({}, cells[id], {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          eggs: {
            nb: cells[id].eggs ? cells[id].eggs + 1 : 1,
            idE: [...idE, eggId],
          },
        }),
      }),
    };
    socket.emit('cells', ret.cells);
    return ret;
  },

  seg: function segProcessing(data, socket) {
    const preProcessing = data.split(' ');
    const ret = {
      end: true,
      winner: preProcessing[1]
    }
    socket.emit('end', ret);
  },

  smg: function smgProcessing(data, socket) {
    const preProcessing = data.split('\'');
    socket.emit('message', preProcessing[1])
  },

}
