"use strict";

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const controllerText = fs.readFileSync(path.join(__dirname, '../models/controllers/controller.js'), 'utf8');
const template = handlebars.compile(controllerText);

module.exports = (controllerName, cb) => {
    let name = controllerName.toLowerCase();
    let modelName = controllerName[0].toUpperCase() + controllerName.slice(1);
    let ctrlName = controllerName[0].toUpperCase() + controllerName.slice(1);
    if (ctrlName.slice(-4).toLowerCase() !== 'ctrl')
        ctrlName += 'Ctrl';
    
    let config = {
        "name": name,
        "modelName": modelName,
        "ctrlName": ctrlName
    };
    
    fs.writeFile(path.join(process.cwd(), 'controllers', ctrlName.toLowerCase() + '.js'), template(config), (err) => {
        if (err) {
            console.log("Error: ", err);
            if (cb && typeof cb === 'function')
                return cb(err)
            else
                return process.exit(1);
        }
        
        let indexjs = fs.readFileSync(path.join(process.cwd(), 'index.js'), 'utf8').split('\n');
        let reqi = indexjs.indexOf('//</alfred-inject-deps>');
        let req = 'const ' + ctrlName + ' = require(\'./controllers/' + ctrlName.toLowerCase() + '\');';
        
        indexjs = [].concat(indexjs.slice(0, reqi), req, indexjs.slice(reqi));
        
        let routi = indexjs.indexOf('//</alfred-inject-routes>');
        let route = ctrlName + '.registerRoutes(app);';
        indexjs = [].concat(indexjs.slice(0, routi), route, indexjs.slice(routi));
        
        fs.writeFileSync(path.join(process.cwd(), 'index.js'), indexjs.join('\n'));
        
        if (cb && typeof cb === 'function')
            return cb(null)
        else
            return process.exit(0);
    });
};
