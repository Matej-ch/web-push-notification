"use strict";

var url = [];
var count = 0;
var CACHE_NAME = 'my-site-cache-v1';

var cacheWhitelist = ['my-site-cache-v1'];


var urlsToCache = [
    '/',
    '/styles/main.css',
    '/script/main.js'
];


self.addEventListener('install', function(event) {
    self.skipWaiting()

    event.waitUntil(caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
        ); //will install the service worker
});

self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys().then(keys => Promise.all(
        keys.map(key => {
            if(cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key);
            }
        })
    ))/*self.clients.claim()*/); //will activate the serviceworker
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function(clientList) {

                if (clients.openWindow) {
                    var c = count;
                    count++;
                    return clients.openWindow(url[c]);
                }
            })
    );

});


self.addEventListener('push', function(event) {
    event.waitUntil(
        self.registration.pushManager.getSubscription()
            .then(function(subscription) {

                console.log("subscription", subscription);

                var payload = event.data ? JSON.parse(event.data.text()) : {
                    title: 'Mathew notification test',
                    body: 'Hello, this is test notification. This is body of notification, and its very cool. I dont know how long it should be',
                    icon: 'https://static.cronj.com/img/logos/cronj-logo.png',
                    url: 'https://old.reddit.com/'
                };


                url.push(payload.url);
                return self.registration.showNotification(payload.title, {
                    body: payload.body,
                    icon: payload.icon,
                    tag: payload.url + payload.body + payload.icon + payload.title
                });


            })
    );
});