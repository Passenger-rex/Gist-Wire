import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let app: FirebaseApp | null = null;

try {
  // Override the database ID as requested
  const finalConfig = {
    ...firebaseConfig,
    firestoreDatabaseId: "ai-studio-05d01ffd-36a6-451b-8025-e95bb12af3d3"
  };

  app = initializeApp(finalConfig);
  db = getFirestore(app, finalConfig.firestoreDatabaseId);
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase not initialized", e);
}
