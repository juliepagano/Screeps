var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

let roomManager = class roomManager {
  constructor (room) {
    this.room = room

    let summary = this.getSummary()
    if (summary) {
      logHelper.log(summary, LOG_LEVEL.INFO)
    }
  }

  getSpawn () {
    let spawns = this.getSpawns()
    if (spawns.length) {
      return spawns[0]
    }
  }

  getSpawns () {
    return this.room.find(FIND_MY_SPAWNS)
  }

  getSummary () {
    if (!this.room) {
      return 'NO ROOM'
    }

    let summary = `Active room: ${this.room.name} (${this.room.mode})`
    return summary
  }
}

module.exports = roomManager;
