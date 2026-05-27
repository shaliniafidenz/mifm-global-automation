const env = require('../config/env');

module.exports = {
    validUser: {
        username: env.login.validUsername,
        password: env.login.validPassword,
    },
    invalidUser: {
        username: env.login.invalidUsername,
        password: env.login.invalidPassword,
    },
};
