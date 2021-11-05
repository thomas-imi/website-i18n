import { copyFile, readdir, readFile } from "fs/promises";
import path from "path";
import url from "url";

import S3 from "aws-sdk/clients/s3.js";
import { createGzip } from "zlib";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const FOLDER_SRC = path.join(__dirname, "..", "src");
const FOLDER_LOCALES = path.join(__dirname, "..", "locales");
const PATH_LOCALES = path.join(FOLDER_SRC, "locales.json");


! async function() {

    try {
        const locales = await getLocales();
        const files = await getSourceFiles();

        await Promise.all(files.map( file =>
                copyToLocaleDir(file)
            ));

        // ToDo: Add actual translation here

    } catch (e) {
        console.log(e);
        process.exit(1);
    }

}();


async function getLocales() {
    const data = await readFile(PATH_LOCALES);
    return JSON.parse(data);
}

async function getSourceFiles() {
    const files = await readdir(FOLDER_SRC);
    const keys = [];

    for (const file of files) {

        if (file.includes("locales.json"))
            continue;
        keys.push(`${FOLDER_SRC}/${file}`);
    }

    return keys;
}

function copyToLocaleDir(file) {
    const name = file.replace(`${FOLDER_SRC}/`, "");
    return copyFile(file, `${FOLDER_LOCALES}/en/${name}`);
}