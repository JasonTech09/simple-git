const { createGzip } = require('zlib');
const { promisify } = require('util');
const { stdout } = require('process');
const { createHash } = require('crypto');
const { pipeline } = require('stream');
const { copyFile, rename, rm } = require('fs/promises');
const path = require('path');
const pipe = promisify(pipeline);
const sha1 = createHash('sha1');

const {
    createReadStream,
    createWriteStream,
} = require('fs');

async function compress(input, output) {
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);

    await pipe(source, gzip, destination);
}

async function calculateSHA(blob) {
    const source = createReadStream(blob);
    let contents = '';
    source.on('data', (err, data) =>  contents += data);
    return sha1.update(contents).digest('hex');
}

async function addToDB(fileName, fileNameHash) {
    await rename(fileName, path.join(__dirname, '/.project/files/', fileNameHash.substring(0,2), fileNameHash.substring(2)));
}

(async () => {
    const files = process.argv.slice(2);    
    for await (let file of files) {
        try {
            const tempFileName = path.join(__dirname, '/', (new Date()).getTime().toString());
            await compress(file, tempFileName);
            const fileNameHash = await calculateSHA(tempFileName);
            await addToDB(tempFileName, fileNameHash);
            console.log(fileNameHash);
        } catch (ex) {
            console.log(ex);
        }
    }

})();