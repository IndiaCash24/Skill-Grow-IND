import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// 1. Production Firebase Configuration for Skill Grow IND
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBmkLO0FtDm7Hcc2pJ1cEaJPjfs6G4x8p4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'skill-grow-ind.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skill-grow-ind',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skill-grow-ind.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1019621936948',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1019621936948:web:f5ed8e6ecd673a01bbdf61',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-G58EG4HPWZ',
};

// 2. Initialize App Singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Analytics if supported in browser environment
export const analyticsPromise = isSupported().then((yes) => (yes ? getAnalytics(app) : null)).catch(() => null);

// 4. Initialize Firestore with Offline Multi-Tab Persistence
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

