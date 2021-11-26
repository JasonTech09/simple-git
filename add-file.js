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
} = require('fs');

async function createBlob(file) {

}

async function compress(input, output) {
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);

    return await pipe(source, gzip, destination);
}

async function calculateSHA(blob) {
    const source = createReadStream(blob);
    let contents = '';
    source.on('data', (err, data) =>  contents += data);
    //source.pipe(sha1).setEncoding('hex').pipe(stdout);
    return sha1.update(contents).digest('hex');
}

async function addToDB(fileName, blob) {

}

(async () => {
    const files = process.argv.slice(2);
    
    for await (let file of files) {
        try {
            console.log(file);
            const deflation = await compress(file, 'abc');
            const fileNameHash = await calculateSHA('abc');
            copyFile(path.join(__dirname, '/abc'), path.join(__dirname, `${fileNameHash}`)); ///', fileNameHash));
            console.log(fileNameHash);
        } catch (ex) {
            console.log(ex);
        }
    }

})();