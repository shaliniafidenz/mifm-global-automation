'use strict';

require('dotenv').config();

function required(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env variable: ${name}. Copy .env.example to .env and fill in the values.`);
    return value;
}

module.exports = {
    login: {
        validUsername:    required('LOGIN_VALID_USERNAME'),
        validPassword:    required('LOGIN_VALID_PASSWORD'),
        invalidUsername:  required('LOGIN_INVALID_USERNAME'),
        invalidPassword:  required('LOGIN_INVALID_PASSWORD'),
    },

    cwo: {
        building:         required('CWO_BUILDING'),
        location:         required('CWO_LOCATION'),
        problemType:      required('CWO_PROBLEM_TYPE'),

        reset: {
            building:     required('CWO_RESET_BUILDING'),
            location:     required('CWO_RESET_LOCATION'),
            problemType:  required('CWO_RESET_PROBLEM_TYPE'),
            description:  required('CWO_RESET_DESCRIPTION'),
        },
    },

    device: {
        name:             required('DEVICE_NAME'),
        platformVersion:  required('PLATFORM_VERSION'),
        appPackage:       required('APP_PACKAGE'),
        appActivity:      required('APP_ACTIVITY'),
    },
};
