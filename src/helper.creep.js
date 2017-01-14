var bodyCosts = {}
bodyCosts[MOVE] = 50
bodyCosts[WORK] = 100
bodyCosts[CARRY] = 50

var creepHelper = {

  getCost (body) {
    var cost = 0
    body.map((item) => {
      cost = cost + bodyCosts[item]
    })

    return cost
  }
}
module.exports = creepHelper;
