import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebase";

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

onMessage(messaging, (payload) => {
  try {
    new Notification(
      payload.notification?.title || "SwaShakti",
      {
        body: payload.notification?.body || "",
        icon: "/vite.svg",
      }
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});