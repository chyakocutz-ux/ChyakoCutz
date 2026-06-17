importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyBji83H8l6-d3a34h566puks6aoUhcmB_Q',
  authDomain:        'chyakocutz-50c4c.firebaseapp.com',
  projectId:         'chyakocutz-50c4c',
  storageBucket:     'chyakocutz-50c4c.firebasestorage.app',
  messagingSenderId: '853091953874',
  appId:             '1:853091953874:web:1275010c4b78b8a6e7110b'
});

try {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const { title, body } = payload.notification || {};
    self.registration.showNotification(title || 'Chyako Cutz', {
      body:  body || '',
      icon:  '/assets/logo.png',
      badge: '/assets/logo.png',
      tag:   payload.data?.bookingId || 'ck',
      data:  payload.data || {}
    });
  });
} catch (_) {}
