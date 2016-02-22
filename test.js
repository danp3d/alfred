"use strict";

let test = {
    a: 'Test',
    log: () => {
        console.log(this.a);
    }
}
test.log();

let test2 = {};
test2.log = test.log;
test2.log();

test2.a = 'Test2';
test2.log();
