let logHelper = require('helper.log')
let memoryHelper = require('helper.memory')

let constructionManagerLib = require('manager.construction')
let controllerManagerLib = require('manager.controller')
let creepManagerLib = require('manager.creep')
let roomManagerLib = require('manager.room')
let spawnManagerLib = require('manager.spawn')
let structureManagerLib = require('manager.structure')

const LOG_LEVEL = require('constants.log')


module.exports.loop = function () {
    logHelper.log('====================LOOP STARTED====================',
        LOG_LEVEL.INFO)

    let creepConfig = {}

    let activeRoomName = _.keys(Game.rooms)[0]
    let activeRoom = Game.rooms[activeRoomName]

    let roomManager = new roomManagerLib(activeRoom)

    let controllerManager = new controllerManagerLib(activeRoom)

    let activeSpawn = roomManager.getSpawn()
    let spawnManager = new spawnManagerLib(activeSpawn)

    let constructionManager = new constructionManagerLib(activeRoom)
    let constructionCount = constructionManager.getTotal()
    creepConfig.builder = {
      min: constructionCount ? 1 : 0,
      max: constructionCount
    }

    let structureManager = new structureManagerLib(activeRoom)
    let repairCount = structureManager.getRepairTotal()
    creepConfig.repairer = {
      min: repairCount ? 1 : 0,
      max: repairCount
    }

    let creeps = roomManager.getCreeps()
    let creepManager = new creepManagerLib(creeps, creepConfig)

    creepManager.spawnCreeps(activeSpawn)

    creepManager.runCreeps()

    memoryHelper.cleanupZombieCreeps()

    logHelper.log('====================================================',
        LOG_LEVEL.INFO)
}
