#!/usr/bin/env node

"use strict";

const program = require('commander');


program
    .version('0.0.1');

program
    .command('init')
    .alias('i')
    .description('initialize package')
    .action(require('./lib/init'));

program
    .command('model <name> [properties...]')
    .alias('m')
    .description('Scaffold new model')
    .action(require('./lib/model'));

program
    .command('controller <name>')
    .alias('c')
    .description('Scaffold new controller')
    .action(require('./lib/controller'));

program
    .command('scaffold <name> [properties...]')
    .alias('s')
    .description('Full deal (model + controller)')
    .action(require('./lib/scaffold'));

program.parse(process.argv);

if (process.argv.length <= 2) {
    program.help();
    process.exit(1);
}
