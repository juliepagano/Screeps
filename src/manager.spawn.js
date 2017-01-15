var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

let spawnManager = class spawnManager {
  constructor (spawn) {
    this.spawn = spawn

    logHelper.log(this.getSummary(), LOG_LEVEL.INFO)
  }

  getSummary () {
    let summary = `Active spawn: ${this.spawn.name} (${this.spawn.energy})`
    if (this.spawn.spawning) {
      let name = this.spawn.spawning.name
      let needTime = this.spawn.spawning.needTime
      let remainingTime = this.spawn.spawning.remainingTime
      let percentComplete = (needTime - remainingTime) / needTime * 100

      summary += ` (spawning ${name} ${percentComplete.toFixed(2)}%)`
    }

    return summary
  }
}

module.exports = spawnManager;
