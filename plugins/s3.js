import { config, Endpoint, S3 } from 'aws-sdk';
import Vue from 'vue';

const CELLAR_ADDON_KEY_ID = '93b3602cc2ccfebd1cca7d57f3e89e6b';
const CELLAR_ADDON_KEY_SECRET = 'ed9bfa82cc205cd8f5e37f516924bd936f40256ee4650abcfdff0856b484ef0a';
const CELLAR_ADDON_HOST = 'https://ceae6cba88ca971c49cdddb22ec35499.r2.cloudflarestorage.com';


config.update({ accessKeyId: CELLAR_ADDON_KEY_ID, secretAccessKey: CELLAR_ADDON_KEY_SECRET });
const endpoint = new Endpoint(CELLAR_ADDON_HOST);
const s3 = new S3({ endpoint });


Vue.prototype.$s3 = s3