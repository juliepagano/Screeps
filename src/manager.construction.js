var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

let constructionManager = class constructionManager {
  constructor (room) {
    this.contructionSites = room.find(FIND_MY_CONSTRUCTION_SITES)

    let summary = this.getSummary()
    if (summary) {
      logHelper.log(summary, LOG_LEVEL.INFO)
    }
  }

  getTotal () {
    return this.contructionSites.length
  }

  getSummary () {
    if (!this.contructionSites.length) {
      // No construction
      return
    }

    let summary = `Active construction: total (${this.contructionSites.length})`
    this.contructionSites.forEach((site) => {
      let progress = site.progress / site.progressTotal * 100
      summary += `, ${site.structureType} (${progress.toFixed(2)}%)`
    })

    return summary
  }
}

module.exports = constructionManager;
