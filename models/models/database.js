"use strict";

const Sequelize = require('sequelize');
const config = require('./../alfred.json');

module.exports = {
    sequelize: new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
        host: config.mysql.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    })
};
