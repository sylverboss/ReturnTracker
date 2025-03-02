import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuNVZmdzcjBDpGnAyH_bfPfFUD7_LgOk4",
  authDomain: "returntrackr.firebaseapp.com",
  projectId: "returntrackr",
  storageBucket: "returntrackr.firebasestorage.app",
  messagingSenderId: "778375923987",
  appId: "1:778375923987:web:4339a05f744814b309b2e6",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
if (Platform.OS !== 'web') {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };