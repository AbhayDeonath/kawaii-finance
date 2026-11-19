const CACHE_NAME = "kawaii-finance-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/kf.svg",
    "./assets/anime-girl.png"
];

// Install: cache the application files.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate: remove old application caches.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: serve cached files when offline.
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Do not intercept external requests.
    if (url.origin !== self.location.origin) return;

    // For page navigation, prefer the network.
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(
                            "./index.html",
                            copy
                        ));

                    return response;
                })
                .catch(async () => {
                    return (
                        await caches.match(request)
                        || await caches.match("./index.html")
                    );
                })
        );

        return;
    }

    // For other files, prefer the cache.
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(request).then((response) => {
                if (response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(request, copy));
                }

                return response;
            });
        })
    );
});
