import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBZtGr_-TZgd1n9_GLPohjO4NQssvN8Qv0",
  authDomain: "intentional-week.firebaseapp.com",
  projectId: "intentional-week",
  storageBucket: "intentional-week.firebasestorage.app",
  messagingSenderId: "355139852191",
  appId: "1:355139852191:web:2264b94492426cb4468faa",
  measurementId: "G-5L9N6PEQ5J"
};

// VAPID key from Firebase Console > Cloud Messaging > Web Push certificates
const VAPID_KEY = 'BIy8KBocckhwWUiQnO5jHr1TAtZTMdSUp_1HMPQNWGhAfIG2PvHGkNRSBxnQJM9AL64HPOKVFlEZa6lMWhxhhsA';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Cloud Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log('FCM not supported in this browser');
}

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      },
      error: null
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      user: null,
      error: error.message
    };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign-out error:', error);
    return { error: error.message };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Request permission and get FCM token
 */
export async function requestNotificationPermission() {
  if (!messaging) {
    return { token: null, error: 'Push notifications not supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { token: null, error: 'Permission denied' };
    }

    // Get FCM token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log('FCM Token:', token);
    return { token, error: null };
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return { token: null, error: error.message };
  }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback) {
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
}

/**
 * Show a local notification (for foreground messages)
 */
export function showNotification(title, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      ...options
    });
    return notification;
  }
  return null;
}

export { auth, messaging };
