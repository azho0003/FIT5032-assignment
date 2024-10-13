import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Resolve the path to the service account key
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialise Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

export default admin;