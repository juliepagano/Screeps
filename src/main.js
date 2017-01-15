var logHelper = require('helper.log');

var creepManagerLib = require('manager.creep')

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const LOG_LEVEL = require('constants.log')


module.exports.loop = function () {
    logHelper.log('====================LOOP STARTED====================',
        LOG_LEVEL.INFO)

    let activeRoomName = 'W17N76'
    let activeRoom = Game.rooms[activeRoomName]
    logHelper.log(`Active room: ${activeRoomName} (${activeRoom.mode}).`, LOG_LEVEL.INFO)

    let activeController = activeRoom.controller
    if (activeController) {
      let progress = activeController.progress / activeController.progressTotal * 100

      let controllerSummary = 'Active controller: '
      controllerSummary += `level ${activeController.level} `
      controllerSummary += `(${progress.toFixed(2)}%), `
      controllerSummary += `downgrading in ${activeController.ticksToDowngrade}`

      if (activeController.safeMode) {
        controllerSummary += `, safe mode for ${activeController.safeMode}`
      }

      logHelper.log(controllerSummary, LOG_LEVEL.INFO)
    }

    let activeSpawnName = 'Spawn1'
    let activeSpawn = Game.spawns[activeSpawnName]
    let spawnSummary = `Active spawn: ${activeSpawnName} (${activeSpawn.energy})`
    if (activeSpawn.spawning) {
      let name = activeSpawn.spawning.name
      let needTime = activeSpawn.spawning.needTime
      let remainingTime = activeSpawn.spawning.remainingTime
      let percentComplete = (needTime - remainingTime) / needTime * 100

      spawnSummary += ` (spawning ${name} ${percentComplete.toFixed(2)}%)`
    }
    logHelper.log(spawnSummary, LOG_LEVEL.INFO)

    let activeContructionSites = activeRoom.find(FIND_MY_CONSTRUCTION_SITES)
    if (activeContructionSites.length) {
      let constructionSummary = `Active construction: total (${activeContructionSites.length})`
      activeContructionSites.forEach((site) => {
        let progress = site.progress / site.progressTotal * 100
        constructionSummary += `, ${site.structureType} (${progress.toFixed(2)}%)`
      })

      logHelper.log(constructionSummary, LOG_LEVEL.INFO)
    }

    var creepManager = new creepManagerLib(Game.creeps)

    let creepBody = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    creepManager.maybeSpawn(activeSpawn, creepBody, 'harvester')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'upgrader')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'builder')

    creepManager.runCreeps()

    logHelper.log('====================================================',
        LOG_LEVEL.INFO)
}
