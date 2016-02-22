const Sequelize = require('sequelize');
const db = require('./database');

module.exports = db.sequelize.define('{{name}}', {
    // more info - http://docs.sequelizejs.com/en/latest/docs/models-definition/
    {{props}}
});
