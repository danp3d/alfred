"use strict";


const fs = require('fs');
const npm = require('npm');
const path = require('path');
const async = require('async');
const utils = require('./utils');
const readline = require('readline');

let config = require('./../models/package.json');
let alfredConf = require('./../models/alfred.json');

let testMode = false;

// ReadLine interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Wrapper to the 'Question' method (ReadLine)
const question = (name, defaultValue, mandatory, cb) => {
    "use strict";

    if (testMode) {
        if (mandatory && !defaultValue) {
            return cb(null, 'test');
        } else {
            return cb(null, defaultValue);
        }
    }

    rl.question(name + ' (' + defaultValue + '): ', (answer) => {
        if (mandatory && !answer && !defaultValue) {
            console.log(name + ' is mandatory');
            question(name, defaultValue, mandatory, cb);
        } else {
            cb(null, (answer || defaultValue));
        }
    });
}

// Configs
let dir = process.cwd();
let projectName = path.basename(dir);
config.name = projectName;

// Functions to make the callbacks easier (we're using async.series here)
const getCfg = (name, defaultVal, mandatory, cb) => {
    question(name, defaultVal, mandatory, cb);
};

const getNpmCfg = (name, prop, mandatory, cb) => {
    getCfg(name, config[prop], mandatory, (err, answer) => {
        config[prop] = answer;
        cb(null, answer);
    });
};

const getMySqlCfg = (name, prop, mandatory, cb) => {
    getCfg(name, alfredConf.mysql[prop], mandatory, (err, answer) => {
        alfredConf.mysql[prop] = answer;
        cb(null, answer);
    });
};

// Actual function to be exported
module.exports = (args, cb) => {
    "use strict";

    if (args && typeof args === 'object' && args.isTesting)
        testMode = true;

    // Run everything synchronously
    async.series([
        (cb) => getNpmCfg('Project name', 'name', true, cb),
        (cb) => getNpmCfg('Description', 'description', false, cb),
        (cb) => getMySqlCfg('MySQL Host', 'host', true, cb),
        (cb) => getMySqlCfg('MySQL User', 'user', true, cb),
        (cb) => getMySqlCfg('MySQL Password', 'password', false, cb),
        (cb) => getMySqlCfg('MySQL DB', 'database', true, cb),
        (cb) => utils.saveJSONToFile(path.join(dir, 'package.json'), config, cb),
        (cb) => utils.saveJSONToFile(path.join(dir, 'alfred.json'), alfredConf, cb),
        (cb) => {
            if (testMode) {
                return cb();
            }
            npm.load(config, cb);
        },
        (cb) => {
            if (testMode) {
                return cb();
            }
            npm.config.set('save', true);
            npm.config.set('save-dev', false);
            npm.commands.install(['mysql', 'sequelize', 'express', 'body-parser', 'jwt-simple', 'bcrypt-nodejs'], cb);
         },
        (cb) => {
            if (testMode) {
                return cb();
            }
            npm.config.set('save', false);
            npm.config.set('save-dev', true);
            npm.commands.install(['mocha', 'should', 'supertest'], cb);
        },
        (cb) => utils.copyFile(path.join(__dirname, '../models/index.js'), path.join(dir, 'index.js'), cb),
        (cb) => fs.mkdir(path.join(dir, 'models'), cb),
        (cb) => utils.copyFile(path.join(__dirname, '../models/models/database.js'), path.join(dir, 'models', 'database.js'), cb),
        (cb) => fs.mkdir(path.join(dir, 'controllers'), cb),
        (cb) => utils.copyFile(path.join(__dirname, '../models/controllers/basecontroller.js'), path.join(dir, 'controllers', 'basecontroller.js'), cb)
    ], (err) => {
        // Error handling
        if (err) {
            console.log('Error: ', err);
            if (cb && typeof cb === 'function')
                return cb(err);

            return process.exit(1);
        }

        if (cb && typeof cb === 'function')
            return cb(null);

        return process.exit(0);
    });
};
