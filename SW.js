const CACHE_NAME = "atmos-weather-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/responsive.css",
  "./css/weather-effects.css",
  "./css/rain.css",
  "./css/snow.css",
  "./js/theme.js",
  "./js/favorites.js",
  "./js/voice.js",
  "./js/aqi.js",
  "./js/alerts.js",
  "./js/map.js",
  "./js/ai.js",
  "./js/charts.js",
  "./js/comparison.js",
  "./js/export.js",
  "./js/globe.js",
  "./js/app.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
  );
});