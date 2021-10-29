import S3 from "@aws-sdk/clients/s3";

import fs from ""


// S3 Variables
const CACHE_TIME = 86400 * 14; // (Seconds Per Day) * Days = Total Seconds

const BUCKET_CONFIG = {
    location: "assets.hcaptcha.com",
    bucket: "website-i18n"
};
const S3Bucket = ;
const S3Path = "captcha/v1";
const S3Config = {
    Bucket      : S3Bucket,
    ACL         : "public-read",
    CacheControl: `max-age=${CacheTime}`
};

const S3Client = new S3();


! function() {

} ();


function upload() {

}