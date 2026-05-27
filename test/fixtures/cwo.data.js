const env = require('../config/env');

module.exports = {
    create: {
        building:    env.cwo.building,
        location:    env.cwo.location,
        problemType: env.cwo.problemType,
    },

    reset: {
        building:    env.cwo.reset.building,
        location:    env.cwo.reset.location,
        problemType: env.cwo.reset.problemType,
        description: env.cwo.reset.description,
    },
};
