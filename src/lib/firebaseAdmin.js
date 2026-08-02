import * as admin from 'firebase-admin';

let db = null;

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // Fallback to Application Default Credentials (GCP) or default app initialization
      admin.initializeApp({
        projectId: projectId || 'unipay-gcp-project',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization warning:', error.message);
  }
}

try {
  db = admin.firestore();
} catch (e) {
  db = null;
}

export { admin, db };
export default db;
