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
