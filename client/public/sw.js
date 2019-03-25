// this is a requirement for add to homescreen
self.addEventListener('fetch', function(event) {
	event.respondWith(fetch(event.request));
});

self.addEventListener('notificationclick', (event) => {
	// console.log('notificationclick', event);
	event.notification.close();
	event.waitUntil(self.clients.openWindow(event.notification.data.click_action));
});

