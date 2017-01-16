var logHelper = require('helper.log');

const LOG_LEVEL = require('constants.log')

const memoryHelper = {
  cleanupZombieCreeps () {
    const memoryCreepNames = _.keys(Memory.creeps)
    const gameCreepNames = _.keys(Game.creeps)
    const zombieNames = _.difference(memoryCreepNames, gameCreepNames)

    logHelper.log(`${zombieNames.length} zombies: ${zombieNames.join(', ')}`,
      LOG_LEVEL.DEBUG)
    zombieNames.forEach((name) => {
      delete Memory.creeps[name]
      logHelper.log(`Cleared zombie creep: ${name}`, LOG_LEVEL.DEBUG);
    })
  }
}

module.exports = memoryHelper
