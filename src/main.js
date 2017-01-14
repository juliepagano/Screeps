var logHelper = require('helper.log');
var creepHelper = require('helper.creep');

var creepManagerLib = require('manager.creep')

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var creepManager = new creepManagerLib()

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

    var activeSpawn = 'Spawn1'

    var harvesters = creepHelper.getCreepsByRole('harvester');
    logHelper.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = Game.spawns[activeSpawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        logHelper.log('Spawning new harvester: ' + newName);
    }

    var upgraders = creepHelper.getCreepsByRole('upgrader');
    logHelper.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < 1) {
        var newName = Game.spawns[activeSpawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        logHelper.log('Spawning new upgrader: ' + newName);
    }

    var builders = creepHelper.getCreepsByRole('builder');
    logHelper.log('Builders: ' + builders.length);

    if(builders.length < 1) {
        var newName = Game.spawns[activeSpawn].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
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
