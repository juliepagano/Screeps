var logHelper = require('helper.log');

var constructionManagerLib = require('manager.construction')
var controllerManagerLib = require('manager.controller')
var creepManagerLib = require('manager.creep')
var spawnManagerLib = require('manager.spawn')
var structureManagerLib = require('manager.structure')

const LOG_LEVEL = require('constants.log')


module.exports.loop = function () {
    logHelper.log('====================LOOP STARTED====================',
        LOG_LEVEL.INFO)

    let activeRoomName = 'W17N76'
    let activeRoom = Game.rooms[activeRoomName]
    logHelper.log(`Active room: ${activeRoomName} (${activeRoom.mode}).`, LOG_LEVEL.INFO)

    let controllerManager = new controllerManagerLib(activeRoom)

    let activeSpawnName = 'Spawn1'
    let activeSpawn = Game.spawns[activeSpawnName]
    let spawnManager = new spawnManagerLib(activeSpawn)

    let constructionManager = new constructionManagerLib(activeRoom)
    let structureManager = new structureManagerLib(activeRoom)
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
