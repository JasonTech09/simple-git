const path = require('path');
const { mkdir, rm } = require('fs/promises');

const MAIN_DIR = `${__dirname}/`;
const PROJECT_DIR = path.join(MAIN_DIR, '.project/');
const FILES_DIR = path.join(PROJECT_DIR, 'files/');

function* seq() {
    for (let i = 1; i <= 255; i++) {
        yield i;
    }
}

async function createDir(dir) {
    try {
        await mkdir(dir);
        return true;
    } catch (ex) {
        return false;
    }
}

(async () => {
    if(!(await createDir(PROJECT_DIR))) {
        console.log('Project directory already exist or failed to create it');
        return;
    }

    if(!(await createDir(FILES_DIR))) {
        console.log('Files directory already created or failed to create it');
        return;
    }

    for await (let idx of [0, ...seq()]) {
        const created = await createDir(path.join(FILES_DIR, idx.toString(16)));
        if (!created) {
            console.log('Files already exist or failed to create them');

            await rm(PROJECT_DIR, { maxRetries: 3, recursive: true, retryDelay: 100 });
            process.exit(-1);
        }
    }
})();