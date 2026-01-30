// IMPORTANT: This file is for SERVER-SIDE use only.
// It initializes a SINGLETON instance of the Firebase Admin SDK.
import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

let app: App;

if (!getApps().length) {
  app = initializeApp({
    // We use the client-side config here.
    // In a real-world scenario with service accounts, you'd use serviceAccount.
    // For this environment, this allows server actions to use the same project.
    projectId: firebaseConfig.projectId,
  });
} else {
  app = getApp();
}

const firestore = getFirestore(app);
const auth = getAuth(app);

export function getSdks() {
  return {
    firestore,
    auth,
  };
}
