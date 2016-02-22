"use strict";

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const modelText = fs.readFileSync(path.join(__dirname, '../models/models/model.js'), 'utf8');
const template = handlebars.compile(modelText);

module.exports = (modelName, properties, cb) => {
    let propDesc = '';
    (properties || []).forEach((prop) => {
        if (propDesc)
            propDesc += ',\n    ';
        propDesc += prop + ': Sequelize.STRING'
    });

    fs.writeFile(path.join(process.cwd(), 'models', modelName.toLowerCase() + '.js'), template({
        name: modelName.toLowerCase(),
        props: propDesc
    }), (err) => {
        if (err) {
            console.log("Error: ", err);
            if (cb && typeof cb === 'function')
                return cb(err)
            else
                return process.exit(1);
        }
        
        if (cb && typeof cb === 'function')
            return cb(null)
        else
            return process.exit(0);
    });
};
