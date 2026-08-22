import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Mobile & Desktop Google Login with automatic Popup/Redirect fallback
export const loginWithGoogle = async () => {
  try {
    // Attempt popup sign in first
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn('Popup sign in blocked or failed, attempting redirect:', error);
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      throw error;
    }
  }
};

// Check for redirect result on mobile app return
getRedirectResult(auth).catch((err) => {
  if (err.code !== 'auth/redirect-cancelled-by-user') {
    console.error('Redirect sign in error:', err);
  }
});

export const logoutUser = async () => {
  await signOut(auth);
};

export default app;
