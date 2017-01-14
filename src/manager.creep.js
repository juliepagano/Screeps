var logHelper = require('helper.log');

var bodyCosts = {}
bodyCosts[MOVE] = 50
bodyCosts[WORK] = 100
bodyCosts[CARRY] = 50

let creepManager = class creepManager {
  constructor (creeps) {
    this.creepRoles = {
      harvester: {
        max: 2
      },
      upgrader: {
        max: 2
      },
      builder: {
        max: 2
      }
    }

    this.creeps = creeps
    this.initCreeps(creeps)

    logHelper.log(JSON.stringify(this.creepRoles))
  }

  initCreeps (creeps) {
    for (let name in creeps) {
      let creep = creeps[name]
      let role = creep.memory.role

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
        logHelper.log(`Successfully created new ${role} creep named ${response}.`)
        return
      }
    }

    logHelper.log(`Something went wrong creating ${role} creep.`)
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
      return this.creeps.length
    }

    if (this.creepRoles[role]) {
      return this.creepRoles[role].count || 0
    }

    return 0
  }
}

module.exports = creepManager;
