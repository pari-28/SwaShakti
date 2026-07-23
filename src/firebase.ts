import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBmBJdu8jrSJLvYlYcx4RZNBl5EgvVb0tc",
  authDomain: "swashakti-e3c24.firebaseapp.com",
  projectId: "swashakti-e3c24",
  storageBucket: "swashakti-e3c24.firebasestorage.app",
  messagingSenderId: "95598741431",
  appId: "1:95598741431:web:ae25394cfa0012c2eb8a32",
};

export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const VAPID_KEY = "BHzaja7_0KvX5mZsInLAhDFt9wMGImSxFBXD3C3jKjRlyFHnGp7XR4sUsmzSFF6l33AeyY8xXxOsyojMqTy8Xw8";