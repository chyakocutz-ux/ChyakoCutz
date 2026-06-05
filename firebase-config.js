const firebaseConfig = {
  apiKey:            "AIzaSyBji83H8l6-d3a34h566puks6aoUhcmB_Q",
  authDomain:        "chyakocutz-50c4c.firebaseapp.com",
  projectId:         "chyakocutz-50c4c",
  storageBucket:     "chyakocutz-50c4c.firebasestorage.app",
  messagingSenderId: "853091953874",
  appId:             "1:853091953874:web:1275010c4b78b8a6e7110b"
};

firebase.initializeApp(firebaseConfig);

window.fbAuth = firebase.auth();
window.fbDb   = firebase.firestore();

// VAPID key: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Key pair
window.CHYAKO_VAPID_KEY = "BE2GMP4fiNzAHd9EE4qTBg0UffqQMFtzoUHRRcm9Y0sYUrmhMc2bMuuiEPR35MfHH9WkKtiGr40jYHAKj6wT7iU";

try {
  window.fbMessaging = firebase.messaging();
  // Foreground messages are handled by the Firestore toast system — suppress duplicate FCM popups
  window.fbMessaging.onMessage(() => {});
} catch (_) {
  window.fbMessaging = null;
}
