var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

      if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
      }
      if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
          creep.memory.repairing = true;
          creep.say('repairing');
      }

      if(creep.memory.repairing) {
          var targets = creep.room.find(FIND_STRUCTURES)
          targets = _.filter(targets, (structure) => {
            return structure.hits < structure.hitsMax &&
              structure.structureType !== STRUCTURE_WALL
          });

          if(targets.length) {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
          }
      }
      else {
        var sources = creep.room.find(FIND_SOURCES);
          if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0]);
          }
      }
  }
};

module.exports = roleRepairer;
