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
    logHelper.log(`Active room: ${activeRoomName}.`, LOG_LEVEL.INFO)

    let activeController = activeRoom.controller
    if (activeController) {
      let progress = activeController.progress / activeController.progressTotal * 100

      let controllerSummary = 'Active controller: '
      controllerSummary += `level ${activeController.level} `
      controllerSummary += `(${progress.toFixed(2)}%), `
      controllerSummary += `downgrading in ${activeController.ticksToDowngrade}`

      logHelper.log(controllerSummary, LOG_LEVEL.INFO)
    }

    var activeSpawnName = 'Spawn1'
    var activeSpawn = Game.spawns[activeSpawnName]
    logHelper.log(`Active spawn: ${activeSpawnName}.`, LOG_LEVEL.INFO)

    var creepManager = new creepManagerLib(Game.creeps)

    var spawns = Game.spawns
    var spawnCount = 0
    var spawnEnergy = 0
    for (var name in spawns) {
        spawnCount++
        spawnEnergy += spawns[name].energy
    }

    logHelper.log(`${spawnCount} spawns with total energy ${spawnEnergy}.`, LOG_LEVEL.INFO)

    let creepBody = [WORK,CARRY,MOVE]
    creepManager.maybeSpawn(activeSpawn, creepBody, 'harvester')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'upgrader')
    creepManager.maybeSpawn(activeSpawn, creepBody, 'builder')

    creepManager.runCreeps()
}
