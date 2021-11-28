const { rename, stat, readFile, writeFile } = require('fs/promises');

const {
    MAIN_DIR,
    PROJECT_DIR,
    DB_PATH,
    FILES_DIR,
} = require('./config');

module.exports = async function(obj) {
    const contents = await readFile(DB_PATH, { encoding: 'utf-8' });
    const db = JSON.parse(contents);

    // TODO: refactor this logic
    let newObj = Object.assign({}, obj);
    const idx = db.findIndex(itm => itm.shaName === newObj.shaName);
    if (idx > -1) {
        newObj = Object.assign(db[idx], newObj);
        db[idx] = newObj;
    } else {
        newObj = Object.assign({}, obj);
        db.push(newObj);
    }

    await writeFile(DB_PATH, JSON.stringify(db));
    return newObj;
};