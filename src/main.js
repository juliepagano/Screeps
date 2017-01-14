var logHelper = require('helper.log');
var creepHelper = require('helper.creep');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var spawns = Game.spawns
    var spawnCount = 0
    var spawnEnergy = 0
    for (var name in spawns) {
        spawnCount++
        spawnEnergy += spawns[name].energy
    }

    logHelper.log(`${spawnCount} spawns with total energy ${spawnEnergy}.`)

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            logHelper.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    logHelper.log('Harvesters: ' + harvesters.length);

    console.log('harvester cost: ' + creepHelper.getCost([WORK,CARRY,MOVE]))
    if(harvesters.length < 2) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        logHelper.log('Spawning new harvester: ' + newName);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    logHelper.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < 1) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgraders'});
        logHelper.log('Spawning new upgrader: ' + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    logHelper.log('Builders: ' + builders.length);

    if(builders.length < 1) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        logHelper.log('Spawning new builder: ' + newName);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
