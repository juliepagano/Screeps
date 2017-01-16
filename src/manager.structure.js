var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

let ignoreStructures = [STRUCTURE_WALL]

let structureManager = class structureManager {
  constructor (room) {
    this.structures = room.find(FIND_STRUCTURES)

    this.structureSummary = {}
    this.initStructures()

    let summary = this.getSummary()
    if (summary) {
      logHelper.log(summary, LOG_LEVEL.INFO)
    }
  }

  initStructures () {
    this.structureSummary = {}

    this.structures.forEach((structure) => {
      let type = structure.structureType

      if (ignoreStructures.indexOf(type) >= 0) {
        // Skip ignored structures
        return
      }

      if (!this.structureSummary[type]) {
        this.structureSummary[type] = {
          count: 0,
          needRepair: 0
        }
      }

      this.structureSummary[type].count++

      if (structure.hits < structure.hitsMax) {
        this.structureSummary[type].needRepair++
      }
    })
  }

  getSummary () {
    if (!this.structures.length) {
      // No structures
      return 'No structures.'
    }

    let summary = `Structures: total (${this.structures.length})`
    _.keys(this.structureSummary).sort((a, b) => {
      let aVal = this.structureSummary[a].count
      let bVal = this.structureSummary[b].count
      return bVal - aVal
    }).forEach((type) => {
      let info = this.structureSummary[type]
      summary += `, ${type} (${info.count}`

      if (info.needRepair) {
        summary += `, ${info.needRepair} to repair`
      }

      summary += ')'
    })

    return summary
  }
}

module.exports = structureManager;
