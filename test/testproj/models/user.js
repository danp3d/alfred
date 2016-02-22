const Sequelize = require('sequelize');
const db = require('./database');

module.exports = db.sequelize.define('user', {
    // more info - http://docs.sequelizejs.com/en/latest/docs/models-definition/
    name: Sequelize.STRING,
    email: Sequelize.STRING
});
