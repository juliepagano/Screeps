var logHelper = require('helper.log');

var creepManagerLib = require('manager.creep')
var constructionManagerLib = require('manager.construction')

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

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

    let constructionManager = new constructionManagerLib(activeRoom)
    var creepManager = new creepManagerLib(Game.creeps)

    let creepBody = [WORK, CARRY, MOVE]
    creepManager.maybeSpawn(activeSpawn, creepBody, 'harvester')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'upgrader')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'builder')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'repairer')

    creepManager.runCreeps()

    logHelper.log('====================================================',
        LOG_LEVEL.INFO)
}
