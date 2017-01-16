let logHelper = require('helper.log');

let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');

const LOG_LEVEL = require('constants.log')

let bodyCosts = {}
bodyCosts[MOVE] = 50
bodyCosts[WORK] = 100
bodyCosts[CARRY] = 50



let creepManager = class creepManager {
  constructor (creeps) {
    this.creepRoles = {
      harvester: {
        max: 2,
        commands: roleHarvester
      },
      upgrader: {
        max: 2,
        commands: roleUpgrader
      },
      builder: {
        max: 2,
        commands: roleBuilder
      },
      repairer: {
        max: 2,
        commands: roleRepairer
      }
    }

    this.creeps = creeps
    this.totalCreeps = 0

    this.initCreeps()

    logHelper.log(JSON.stringify(this.creepRoles), LOG_LEVEL.DEBUG)

    logHelper.log(this.getCreepSummary(), LOG_LEVEL.INFO)
  }

  initCreeps () {
    this.creeps.forEach((creep) => {
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
      this.creepRoles[role].creeps.push(creep.name)
    })
  }

  getCreepSummary () {
    let creepSummary = `Creeps: total (${this.totalCreeps})`
    for (let role in this.creepRoles) {
      let creepRole = this.creepRoles[role]
      let roleCreeps = creepRole.creeps
      let maxCreeps = creepRole.max || 0
      let totalCreeps = roleCreeps ? roleCreeps.length : 0
      creepSummary += `, ${role} (${totalCreeps}/${maxCreeps})`
    }
    return creepSummary
  }

  runCreeps () {
    for (let role in this.creepRoles) {
      let names = this.creepRoles[role].creeps || []
      let commands = this.creepRoles[role].commands

      if (names.length && commands) {
        names.forEach((name) => {
          commands.run(Game.creeps[name])
        })
      }
    }
  }

  getBodyCost (body) {
    let cost = 0
    body.map((item) => {
      cost = cost + bodyCosts[item]
    })

    return cost
  }

  spawnCreeps (spawn) {
    let body = [WORK, CARRY, MOVE]

    for (let role in this.creepRoles) {
      if (this.maybeSpawn(spawn, body, role)) {
        return
      }
    }
  }

  // Spawn if not beyond max
  maybeSpawn (spawn, body, role) {
    if (!this.shouldSpawnMore(role)) {
      logHelper.log('Already have max ' + role)
      return false
    }

    let bodyCost = this.getBodyCost(body)
    let availableEnergy = spawn.room.energyAvailable
    if (bodyCost > availableEnergy) {
      logHelper.log(`Not enough energy to spawn ${role}. Have ${availableEnergy}. Need ${bodyCost}`)
      return false
    }

    let ok = 0
    if (spawn.canCreateCreep(body) === ok) {
      let response = spawn.createCreep(body, undefined, { role: role })

      if (typeof response === 'string') {
        logHelper.log(`Successfully created new ${role} creep named ${response}.`,
          LOG_LEVEL.INFO)
        return true
      }
    }

    logHelper.log(`Something went wrong creating ${role} creep.`, LOG_LEVEL.ERROR)
    return false
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
