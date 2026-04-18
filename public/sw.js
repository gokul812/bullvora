// Bullvora Service Worker — handles Web Push notifications

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", function (event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Bullvora Alert", body: event.data ? event.data.text() : "Price alert triggered!" };
  }

  const options = {
    body: data.body || "Your price alert has been triggered.",
    icon: "/globe.svg",
    badge: "/globe.svg",
    tag: data.alertId || "bullvora-alert",
    renotify: true,
    data: { url: data.url || "/alerts", alertId: data.alertId },
    vibrate: [200, 100, 200],
    actions: [{ action: "view", title: "View Alerts" }],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Bullvora Alert", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/alerts";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      })
  );
});
