import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// 1. Enterprise Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeySkillGrowInd2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'skill-grow-ind.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skill-grow-ind',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skill-grow-ind.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '424492077084',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:424492077084:web:328fba3420d3424492077084',
};

// 2. Initialize App Singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Firestore with Offline Multi-Tab Persistence
let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  // Fallback if persistent cache already initialized
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth: Auth = getAuth(app);
