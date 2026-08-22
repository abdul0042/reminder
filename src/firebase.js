import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCCqTXWCRUp4DW5QhMRjFs7lFOR4o-admY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "reminder-94d10.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "reminder-94d10",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "reminder-94d10.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "838785770196",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:838785770196:web:f434fa4bab728b554c5141"
};

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Sign Up with Email and Password
export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

// Sign In with Email and Password
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export default app;
