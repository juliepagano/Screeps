var bodyCosts = {}
bodyCosts[MOVE] = 50
bodyCosts[WORK] = 100
bodyCosts[CARRY] = 50

var creepHelper = {

  getCost: function (body) {
    var cost = 0
    body.map((item) => {
      cost = cost + bodyCosts[item]
    })

    return cost
  },

  getCreepsByRole: function (role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role)
  }
}
module.exports = creepHelper;
