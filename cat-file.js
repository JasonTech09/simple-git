const { createGzip } = require('zlib');
const { promisify } = require('util');
const { stdout } = require('process');
const { createHash } = require('crypto');
const { pipeline } = require('stream');
const { copyFile } = require('fs/promises');
const path = require('path');
const pipe = promisify(pipeline);
const sha1 = createHash('sha1');

const {
    createReadStream,
    createWriteStream,
    rename,
} = require('fs');

async function getFileFullyQualifiedPath(fileName) {
    return path.join(__dirname, '/.project/files', fileName.substring(0,2), '/', fileName.substring(2));
}


async function inflate(fileName) {
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);

    await pipe(source, gzip, destination);
}

async function getFromDB(fileName) {
    const tempFileName = path.join(__dirname, '/', (new Date()).getTime());
    await copyFile(fileName, tempFileName);
    return tempFileName;
}

async function decompress(filePath) {

}

(async () => {
    const files = process.argv.slice(2);

    for await (let file of files) {
        const newFilePath = await getFromDB(getFileFullyQualifiedPath(file));
        const newFile = await inflate(newFilePath);

        await cleanup(newFilePath);
        console.log(`${file} output: ${newFile}`);
    }
})();