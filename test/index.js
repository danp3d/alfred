"use strict";

const fs = require('fs');
const path = require('path');

process.chdir(path.join(__dirname, 'testproj'));

const async = require('async');
const assert = require('assert');
const rimraf = require('rimraf');
const init = require('./../lib/init');
const model = require('./../lib/model');
const scaffold = require('./../lib/scaffold');
const controller = require('./../lib/controller');


const pathExists = (filepath, cb) => {
    let fullpath = path.join(__dirname, ...filepath);
    fs.exists(fullpath, (exists) => {
        assert(exists, fullpath + ' not found');
        cb();
    });
};

describe('Alfred', () => {
    // Delete and recreate our test folder
    before((done) => {
        rimraf(path.join(__dirname, 'testproj'), {}, (err) => {
            if (err) return done(err);

            fs.mkdir(path.join(__dirname, 'testproj'), done);
        });
    });

    // Try to initialize it
    it('should initialize a new project', (done) => {
        process.chdir(path.join(__dirname, 'testproj'));
        init({
            isTesting: true
        }, (err) => {
            async.series([
                (cb) => pathExists(['testproj', 'index.js'], cb),
                (cb) => pathExists(['testproj', 'alfred.json'], cb),
                (cb) => pathExists(['testproj', 'package.json'], cb),
                (cb) => pathExists(['testproj', 'controllers'], cb),
                (cb) => pathExists(['testproj', 'controllers', 'basecontroller.js'], cb),
                (cb) => pathExists(['testproj', 'models'], cb),
                (cb) => pathExists(['testproj', 'models', 'database.js'], cb)
            ], (err) => done(err));
        });
    });

    it('should create new model', (done) => {
        process.chdir(path.join(__dirname, 'testproj'));
        model('user', ['name', 'email'], (err) => {
            pathExists(['testproj', 'models', 'user.js'], done);
        });
    });

    it('should create new control', (done) => {
        process.chdir(path.join(__dirname, 'testproj'));
        controller('user', (err) => {
            async.series([
                (cb) => pathExists(['testproj', 'controllers', 'userctrl.js'], cb),
                (cb) => {
                    let indexjs = fs.readFileSync(path.join(process.cwd(), 'index.js'), 'utf8').split('\n');
                    assert(indexjs.indexOf('const UserCtrl = require(\'./controllers/userctrl\');') >= 0, 'Couldn\'t find deps');
                    assert(indexjs.indexOf('UserCtrl.registerRoutes(app);') >= 0, 'Couldn\'t find routes');
                    done();
                }
            ], (err) => done(err));
        });
    });

    it('should create new scaffold', (done) => {
        process.chdir(path.join(__dirname, 'testproj'));
        scaffold('user', ['name', 'email'], (err) => {
            async.series([
                (cb) => pathExists(['testproj', 'models', 'user.js'], done),
                (cb) => pathExists(['testproj', 'controllers', 'userctrl.js'], cb),
                (cb) => {
                    let indexjs = fs.readFileSync(path.join(process.cwd(), 'index.js'), 'utf8').split('\n');
                    assert(indexjs.indexOf('const UsrCtrl = require(\'./controllers/userctrl\');') >= 0, 'Couldn\'t find deps');
                    assert(indexjs.indexOf('UsrCtrl.registerRoutes(app);') >= 0, 'Couldn\'t find routes');
                    done();
                }
            ], (err) => done(err));
        });
    })
});
