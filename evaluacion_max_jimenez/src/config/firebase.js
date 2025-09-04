// components/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, test} from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID    
};

console.log(test);
console.log("Valor de configuracion", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (app) {
  console.log('Firebase initialized successfully');
} else {
  console.log('Firebase initialization failed');
}

// Initialize Firestore
const database = getFirestore(app);
const db = database; // Alias para consistency
if (database) {
  console.log('Firestore initialized correctly');
} else {
  console.log('Firestore initialization failed');
}

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('Auth initialized correctly');
} catch (error) {
  // Si ya está inicializado, usar getAuth
  auth = getAuth(app);
  console.log('Auth already initialized, using existing instance');
}

// Initialize Storage (commented out)
/*
const storage = getStorage(app);
if (storage) {
  console.log('storage initialized correctly');
} else {
  console.log('storage initialization failed');
}
*/

// Export both old names and new names for compatibility
export { database, db, auth };
export default app;