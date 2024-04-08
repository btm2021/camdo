import { config, Endpoint, S3 } from 'aws-sdk';
import Vue from 'vue';

const CELLAR_ADDON_KEY_ID = '62e4c957f0069bcb02b970341b0e1fb3';
const CELLAR_ADDON_KEY_SECRET = 'e9fc7ca5e335b5e9a0b823d5858b66c727fffb6a59390d7803318f04f735d21c';
const CELLAR_ADDON_HOST = 'https://ceae6cba88ca971c49cdddb22ec35499.r2.cloudflarestorage.com';


config.update({ accessKeyId: CELLAR_ADDON_KEY_ID, secretAccessKey: CELLAR_ADDON_KEY_SECRET });
const endpoint = new Endpoint(CELLAR_ADDON_HOST);
const s3 = new S3({ endpoint });


Vue.prototype.$s3 = s3