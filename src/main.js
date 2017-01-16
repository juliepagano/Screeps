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

    let activeRoomName = _.keys(Game.rooms)[0]
    let activeRoom = Game.rooms[activeRoomName]
    logHelper.log(`Active room: ${activeRoomName} (${activeRoom.mode}).`, LOG_LEVEL.INFO)

    let controllerManager = new controllerManagerLib(activeRoom)

    let activeSpawnName = 'Spawn1'
    let activeSpawn = Game.spawns[activeSpawnName]
    let spawnManager = new spawnManagerLib(activeSpawn)

    let constructionManager = new constructionManagerLib(activeRoom)
    let structureManager = new structureManagerLib(activeRoom)
    var creepManager = new creepManagerLib(Game.creeps, activeRoom)

    creepManager.spawnCreeps(activeSpawn)

    creepManager.runCreeps()

    logHelper.log('====================================================',
        LOG_LEVEL.INFO)
}
