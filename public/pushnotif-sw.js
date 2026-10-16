/**
 * PushNotif Service Worker v1.1.0
 * Handles encrypted W3C Web Push events, CTR click tracking, and click navigation.
 */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    campaign_id: "",
    title: "Pesan Baru",
    body: "Anda menerima pemberitahuan baru.",
    url: "/",
    icon: "/static/icon-192.png",
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = Object.assign(data, parsed);
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.icon,
    data: {
      url: data.url || "/",
      campaign_id: data.campaign_id || "",
    },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const payloadData = event.notification.data || {};
  const targetUrl = payloadData.url || "/";
  const campaignId = payloadData.campaign_id || "";

  const trackPromise = campaignId
    ? fetch(`https://pushnotif.biz.id/api/v1/campaigns/${encodeURIComponent(campaignId)}/click`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {})
    : Promise.resolve();

  const navPromise = self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    });

  event.waitUntil(Promise.all([trackPromise, navPromise]));
});
