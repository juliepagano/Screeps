var logHelper = require('helper.log');

var constructionManagerLib = require('manager.construction')
var controllerManagerLib = require('manager.controller')
var creepManagerLib = require('manager.creep')
var roomManagerLib = require('manager.room')
var spawnManagerLib = require('manager.spawn')
var structureManagerLib = require('manager.structure')

const LOG_LEVEL = require('constants.log')


module.exports.loop = function () {
    logHelper.log('====================LOOP STARTED====================',
        LOG_LEVEL.INFO)

    let activeRoomName = _.keys(Game.rooms)[0]
    let activeRoom = Game.rooms[activeRoomName]

    let roomManager = new roomManagerLib(activeRoom)

    let controllerManager = new controllerManagerLib(activeRoom)

    let activeSpawn = roomManager.getSpawn()
    let spawnManager = new spawnManagerLib(activeSpawn)

    let constructionManager = new constructionManagerLib(activeRoom)
    let structureManager = new structureManagerLib(activeRoom)
    var creepManager = new creepManagerLib(Game.creeps, activeRoom)

    creepManager.spawnCreeps(activeSpawn)

    creepManager.runCreeps()

    logHelper.log('====================================================',
        LOG_LEVEL.INFO)
}
