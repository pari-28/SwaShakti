importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBmBJdu8jrSJLvYlYcx4RZNBl5EgvVb0tc",
  authDomain: "swashakti-e3c24.firebaseapp.com",
  projectId: "swashakti-e3c24",
  storageBucket: "swashakti-e3c24.firebasestorage.app",
  messagingSenderId: "95598741431",
  appId: "1:95598741431:web:ae25394cfa0012c2eb8a32",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background notification:", payload);

  self.registration.showNotification(
    payload.notification?.title || "SwaShakti",
    {
      body: payload.notification?.body || "",
      icon: "/vite.svg",
    }
  );
});