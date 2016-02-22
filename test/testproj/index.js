"use strict";

const express = require('express');
const db = require('./lib/database');
const bodyparser = require('body-parser');
const config = require('./alfred.json');
//<alfred-inject-deps>
const UserCtrl = require('./controllers/userctrl');
const UserCtrl = require('./controllers/userctrl');
//</alfred-inject-deps>

let app = express();
let env = process.env.NODE_ENV || 'development';

// Enable body parser
app.use(bodyparser.json());

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

//<alfred-inject-routes>
UserCtrl.registerRoutes(app);
UserCtrl.registerRoutes(app);
//</alfred-inject-routes>

let port = process.env.PORT || config[env].port;
app.listen(port);
console.log('Listening on port ' + port);