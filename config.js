const path = require('path');

const MAIN_DIR = `${__dirname}/`;
const WORKSPACE_DIR = path.join(MAIN_DIR, '.workspace/');
const DB_PATH = path.join(WORKSPACE_DIR, 'db.json');
const OBJECTS_DIR = path.join(WORKSPACE_DIR, 'objects/');

module.exports = {
    MAIN_DIR,
    WORKSPACE_DIR,
    DB_PATH,
    OBJECTS_DIR,
};