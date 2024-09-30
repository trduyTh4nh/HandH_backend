import { storage } from "firebase-admin";
const multer = require("multer");
const admin = require("firebase-admin");
import env from "dotenv";
env.config();

const CONFIG: any = process.env.JSONCONFIG_STORAGE;
const serviceAccount = require(`../../${CONFIG}`);
const BUCKET: any = process.env.BUCKET;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

export const bucket = admin.storage().bucket();
export const upload = multer({ storage });
