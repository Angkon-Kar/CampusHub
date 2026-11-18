// server/config/firebaseAdmin.js
import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin;

  try {
    // Method 1: সরাসরি JSON ফাইল থেকে লোড করা (সবচেয়ে নিরাপদ, কোনো পার্সিং এরর আসবে না)
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    const resolvedPath = path.resolve(process.cwd(), keyPath);

    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase Admin Initialized via serviceAccountKey.json!');
      return admin;
    }

    // Method 2: পরে যখন Render-এ ডেপ্লয় করবে, তখন Environment Variable থেকে লোড করার জন্য
    if (process.env.FIREBASE_PRIVATE_KEY) {
      const cleanKey = process.env.FIREBASE_PRIVATE_KEY
        .replace(/^["']|["']$/g, '')
        .split(String.raw`\n`)
        .join('\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: cleanKey,
        }),
      });
      console.log('🔥 Firebase Admin Initialized via ENV variables!');
    }
  } catch (error) {
    console.error('❌ Firebase Admin Error:', error.message);
  }

  // Fail fast: without credentials every protected route would break at request time
  if (admin.apps.length === 0) {
    console.error('❌ Firebase Admin has no credentials. Set FIREBASE_SERVICE_ACCOUNT_PATH or the FIREBASE_* variables.');
    process.exit(1);
  }

  return admin;
};

export default initFirebaseAdmin();