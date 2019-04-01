import { messaging } from "./configureFirebase";
import axios from "axios";

function showNotificationsWhenAppInForeground(serviceWorkerRegistration) {
  messaging.onMessage(function(payload) {
    serviceWorkerRegistration.showNotification("Alerts for Binance", {
      body: payload.notification.body,
      requireInteraction: "true",
      data: { click_action: payload.notification.click_action }
    });
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => showNotificationsWhenAppInForeground(reg), function(err) {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

export async function requestNotificationPermission() {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    postNotificationTokenToApi(token);
  } catch (error) {
    console.log("error", error);
  }
}

async function postNotificationTokenToApi(token) {
  try {
    await axios.post("/api/users/notification-token", {
      notificationToken: token
    });
  } catch (error) {
    console.log("error", error);
  }
}

export function setupOnTokenRefresh() {
  messaging.onTokenRefresh(function() {
    messaging
      .getToken()
      .then(function(refreshedToken) {
        postNotificationTokenToApi(refreshedToken);
      })
      .catch(function(err) {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });
}
