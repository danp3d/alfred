"use strict";
const fs = require('fs');

module.exports = {
    copyFile: (srcPath, destPath, cb) => {
        let cbCalled = false;
        const cbAux = (err, data) => {
            if (!cbCalled)
                cb(err, data);
        };

        let src = fs.createReadStream(srcPath);
        src.on('error', cbAux);

        let dest = fs.createWriteStream(destPath);
        dest.on('error', cbAux);
        dest.on('close', () => cbAux(null));

        src.pipe(dest);
    },
    saveJSONToFile: (filePath, contents, cb) => {
        fs.writeFile(filePath, JSON.stringify(contents, null, 4) + '\n', (err) => {
            if (err)
                return cb(err);

            cb(null);
        });
    }
};
