import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";

// Konversi ke __dirname dalam ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi Firebase
const serviceAccount = path.join(__dirname, "../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "isenafktp.appspot.com", 
});

const bucket = admin.storage().bucket();

export { bucket };