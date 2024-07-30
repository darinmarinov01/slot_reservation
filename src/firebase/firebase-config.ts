  // libs/firebase/config.ts
import { getAuth } from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import firebase from 'firebase/app'
import { getFirestore } from "firebase/firestore"

// Load .env variables
const firebaseConfig = {
  apiKey:  "AIzaSyBAI-87XyibdZseoJ6A82ITPOKwCPFYKvg",
  authDomain: "parking-system-65efd.firebaseapp.com",
  projectId: 'parking-system-65efd',
  storageBucket: "parking-system-65efd.appspot.com",
  messagingSenderId: "362463237115",
  appId: "1:362463237115:web:2318fbeb1489d76c2c315e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const firebaseAuth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)