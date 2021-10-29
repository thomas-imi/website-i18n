import { access, readdir, readFile, stat } from "fs/promises";
import { constants, createReadStream } from "fs";
import path from "path";
import url from "url";

import S3 from "aws-sdk/clients/s3.js";
import { createGzip } from "zlib";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const FOLDER_LOCALES = path.join(__dirname, "..", "locales");
const CACHE_TIME = 86400 * 14; // (Seconds Per Day) * Days = Total Seconds

const BUCKET_CONFIG = {
    bucket: "assets.hcaptcha.com",
    key: "website-i18n"
};

const S3Client = new S3();

! async function() {
    try {
        const translations = await getFiles(FOLDER_LOCALES);
        await Promise.all(translations.map(
            translation => upload(translation)
            ));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
} ();


async function getFiles(directory) {
    const files = await readdir(directory);
    const locales = [];

    for (const file of files) {

        if (file === ".DS_Store") {
            continue;
        }

        const path = `${directory}/${file}`;

        await access(path, constants.R_OK | constants.W_OK);
        const stats = await stat(path);

        if (stats.isDirectory()) {
            locales.push(...await getFiles(path));
        } else {
            locales.push(path);
        }
    }

    return locales;
}


function upload(file) {
    const path = file.replace(`${FOLDER_LOCALES}/`, "");

    const config = {
        Bucket: BUCKET_CONFIG.bucket,
        ACL: "public-read",
        ContentType: "application/json",
        Key: `${BUCKET_CONFIG.key}/${path}`,
        CacheControl: `max-age=${CACHE_TIME}`,
        Body: createReadStream(file).pipe(createGzip())
    };

    return new Promise(( resolve, reject) => {

        S3Client.upload(config, (err, data) => {
            if (err) {
                console.log(`Upload Failed: ${path}`);
                reject(err)
            } else {
                console.log(`Uploaded Success: ${path}`);
                resolve(data);
            }
        });
    });
}
