var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

let controllerManager = class controllerManager {
  constructor (room) {
    this.controller = room.controller

    let summary = this.getSummary()
    if (summary) {
      logHelper.log(summary, LOG_LEVEL.INFO)
    }
  }

  getSummary () {
    if (!this.controller) {
      return 'No controller in room.'
    }

    let progress = this.controller.progress / this.controller.progressTotal * 100

    let summary = 'Active controller: '
    summary += `level ${this.controller.level} `
    summary += `(${progress.toFixed(2)}%), `
    summary += `downgrading in ${this.controller.ticksToDowngrade}`

    if (this.controller.safeMode) {
      summary += `, safe mode for ${this.controller.safeMode}`
    }

    return summary
  }
}

module.exports = controllerManager;
