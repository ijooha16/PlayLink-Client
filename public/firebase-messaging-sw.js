// /public/firebase-messaging-sw.js
// firebase-app, firebase-messaging import
importScripts(
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAbFsDsxknMYFX05td8JPbdyKs1z33d5Lw',
  authDomain: 'playlink-009.firebaseapp.com',
  projectId: 'playlink-009',
  storageBucket: 'playlink-009.appspot.com',
  messagingSenderId: '453417412512',
  appId: '1:453417412512:web:3f55a3233aa40e9a2666c5',
  measurementId: 'G-W935FZPEJ1',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background message:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // 원하는 아이콘
  });
});
