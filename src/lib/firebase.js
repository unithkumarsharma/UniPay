import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, push, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://unipay-3b9c6-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unipay-3b9c6',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const rtdb = getDatabase(app);

export { app, rtdb, ref, onValue, set, update, push, serverTimestamp };
