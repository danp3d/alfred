"use strict";

const model = require('./model');
const controller = require('./controller');

module.exports = (name, props, cb) => {
    model(name, props, (err) => {
        controller(name, (err) => {
            if (err) {
                if (cb && typeof cb === 'function')
                    return cb(err);
                else
                    return process.exit(1);
            }

            if (cb && typeof cb === 'function')
                return cb();
            else
                process.exit(0);
        });
    });
    
};