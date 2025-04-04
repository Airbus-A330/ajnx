const { readdirSync } = require("node:fs");
const { resolve } = require("node:path");

const getFiles = function* (dir) {
    const dirents = readdirSync(dir, {
        withFileTypes: true,
    });

    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);

        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
};

module.exports = getFiles;
