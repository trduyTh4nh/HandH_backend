import { storage } from "firebase-admin";
const multer = require("multer");
const admin = require("firebase-admin");
import env from "dotenv";
env.config();

const CONFIG: any = process.env.JSONCONFIG_STORAGE;
const CONFIGDATA: any = process.env.SDKCONFIG;
const TESTURRI: any = process.env.URI;
// const serviceAccount = require(`../../${CONFIG}`);

const { private_key } = JSON.parse(process.env.PRIVATEKEY || "");

console.log("DEBUG private_key: ", private_key);

const serviceAccount = {
  type: process.env.TYPE || "",
  project_id: process.env.PROJECTID || "",
  private_key_id: process.env.PRIVATEKEYID || "",
  private_key: private_key.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENTEMAIL || "",
  client_id: process.env.CLIENTID || "",
  auth_uri: process.env.AUTHURI || "",
  token_uri: process.env.TOKENURI || "",
  auth_provider_x509_cert_url: process.env.AUTHPROVIDERX509CERTURL || "",
  client_x509_cert_url: process.env.CLIENTX509CERTURL || "",
  universe_domain: process.env.UNIVERSEDOMAIN || "",
};

const BUCKET: any = process.env.BUCKET;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

export const bucket = admin.storage().bucket();
export const upload = multer({ storage });
