var logHelper = require('helper.log');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const LOG_LEVEL = require('constants.log')

var bodyCosts = {}
bodyCosts[MOVE] = 50
bodyCosts[WORK] = 100
bodyCosts[CARRY] = 50

let creepManager = class creepManager {
  constructor (creeps) {
    this.creepRoles = {
      harvester: {
        max: 5,
        commands: roleHarvester
      },
      upgrader: {
        max: 4,
        commands: roleUpgrader
      },
      builder: {
        max: 5,
        commands: roleBuilder
      }
    }

    this.creeps = creeps
    this.totalCreeps = 0

    this.cleanupZombieCreeps(creeps)
    this.initCreeps(creeps)

    logHelper.log(JSON.stringify(this.creepRoles), LOG_LEVEL.DEBUG)


    logHelper.log(this.getCreepSummary(), LOG_LEVEL.INFO)
  }

  initCreeps (creeps) {
    for (let name in creeps) {
      let creep = creeps[name]
      let role = creep.memory.role

      this.totalCreeps++

      if (!this.creepRoles[role]) {
        this.creepRoles[role] = {
          max: 0
        }
      }

      if (!this.creepRoles[role].count) {
        this.creepRoles[role].count = 1
      } else {
        this.creepRoles[role].count += 1
      }

      if (!this.creepRoles[role].creeps) {
        this.creepRoles[role].creeps = []
      }
      this.creepRoles[role].creeps.push(creep)
    }
  }

  cleanupZombieCreeps (creeps) {
    const memoryCreepNames = _.keys(Memory.creeps)
    const gameCreepNames = _.keys(creeps)
    const zombieNames = _.difference(memoryCreepNames, gameCreepNames)

    logHelper.log(`${zombieNames.length} zombies: ${zombieNames.join(', ')}`,
      LOG_LEVEL.DEBUG)
    zombieNames.forEach((name) => {
      delete Memory.creeps[name]
      logHelper.log(`Cleared zombie creep: ${name}`, LOG_LEVEL.DEBUG);
    })
  }

  getCreepSummary () {
    let creepSummary = `Creeps: total (${this.totalCreeps})`
    for (let role in this.creepRoles) {
      let creepRole = this.creepRoles[role]
      let roleCreeps = creepRole.creeps
      let maxCreeps = creepRole.max || 0
      if (roleCreeps && roleCreeps.length) {
        creepSummary += `, ${role} (${roleCreeps.length}/${maxCreeps})`
      }
    }
    return creepSummary
  }

  runCreeps () {
    for (let role in this.creepRoles) {
      let roleCreeps = this.creepRoles[role].creeps
      let commands = this.creepRoles[role].commands

      if (roleCreeps && commands) {
        for (let i = 0; i < roleCreeps.length; i++) {
          let creep = roleCreeps[i]
          commands.run(creep)
        }
      }
    }
  }

  getBodyCost (body) {
    var cost = 0
    body.map((item) => {
      cost = cost + bodyCosts[item]
    })

    return cost
  }

  // Spawn if not beyond max
  maybeSpawn (spawn, body, role) {
    if (!this.shouldSpawnMore(role)) {
      logHelper.log('Already have max ' + role)
      return
    }

    let bodyCost = this.getBodyCost(body)
    if (bodyCost > spawn.energy) {
      logHelper.log(`Not enough energy to spawn ${role}. Have ${spawn.energy}. Need ${bodyCost}`)
      return
    }

    let ok = 0
    if (spawn.canCreateCreep(body) === ok) {
      let response = spawn.createCreep(body, undefined, { role: role })

      if (typeof response === 'string') {
        logHelper.log(`Successfully created new ${role} creep named ${response}.`,
          LOG_LEVEL.INFO)
        return
      }
    }

    logHelper.log(`Something went wrong creating ${role} creep.`, LOG_LEVEL.ERROR)
  }

  shouldSpawnMore (role) {
    let currentCount = this.creepRoles[role].count || 0
    let max = this.creepRoles[role].max
    if (max === undefined) {
      max = 9999
    }

    return (currentCount < max)
  }

  getCreepCount (role) {
    if (!role) {
      return this.totalCreeps
    }

    if (this.creepRoles[role]) {
      return this.creepRoles[role].count || 0
    }

    return 0
  }
}

module.exports = creepManager;
