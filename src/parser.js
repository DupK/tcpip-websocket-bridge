module.exports = {

  translate: function translate(raw) {
    return (JSON.stringify(raw.toString('utf8'))).split("\\n");
  },

  getMapSize: function getMapSize(raw) {
    const preProcessing = raw.split(' ');
    return {
      width: parseInt(preProcessing[1], 10),
      height: parseInt(preProcessing[2], 10),
    }
  },

  getSegment: function getSegment(raw) {
    const preProcessing = raw.split(" ");
    return parseInt(preProcessing[1], 10);
  },

  extractDetails: function extractDetails(element) {
    return element.includes("bct");
  },

  transformDetails: function transformDetails(element) {
    var tmp = element.split(" ");
    return {
      x: parseInt(tmp[1], 10),
      y: parseInt(tmp[2], 10),
      life: parseInt(tmp[3], 10),
      resources: [
        parseInt(tmp[4], 10),
        parseInt(tmp[5], 10),
        parseInt(tmp[6], 10),
        parseInt(tmp[7], 10),
        parseInt(tmp[8], 10),
        parseInt(tmp[9], 10),
      ],
    }
  },

  getDetails: function getDetails(raw, mapSize) {
    var tmp = raw.filter(this.extractDetails);
    var ret = tmp.reduce((acc, val, index) => {
      const cell = this.transformDetails(val);
      const id = parseInt(cell.x, 10) * parseInt(mapSize.width, 10) + parseInt(cell.y, 10);
      return Object.assign({}, acc, {
        [id]: cell
      });
    }, {});
    return ret;
  },

  extractTeams: function extractTeams(element) {
    return element.includes("tna");
  },

  transformTeams: function transformTeams(element) {
    var tmp = element.split(" ");
    return tmp[1];
  },

  getTeams: function getTeams(raw) {
    var tmp = raw.filter(this.extractTeams);
    var ret = tmp.map(this.transformTeams);
    return ret;
  },

  payloadProcessing: function payloadProcessing(payload, state) {
    const preProcessing = payload.split('\n');

    return {
      mapSize: this.getMapSize(preProcessing[0]),
      segment: this.getSegment(preProcessing[1]),
      cells: this.getDetails(preProcessing, state.mapSize),
      teams: this.getTeams(preProcessing),
    }
  },
}
