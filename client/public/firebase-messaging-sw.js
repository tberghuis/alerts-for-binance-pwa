importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.0/firebase-messaging.js');

// use firebase-messaging-sw-config.js.example as template
importScripts('/firebase-messaging-sw-config.js');

firebase.messaging();



