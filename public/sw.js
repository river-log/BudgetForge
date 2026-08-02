const CACHE_VERSION = "budgetforge-shell-development";
const SHELL_URL = "/";
const OFFLINE_URL = "/offline.html";
const BUILD_ASSETS = [];
const PRECACHE = [
  SHELL_URL,
  OFFLINE_URL,
  "/site.webmanifest",
  "/branding/app-icon.svg",
  "/branding/app-icon-192.png",
  "/branding/app-icon-512.png",
  "/branding/app-icon-maskable-512.png",
  "/branding/budgetforge-horizontal.svg",
  "/branding/forge-mark.svg"
];

const API_HOST_SUFFIXES = [".supabase.co", ".supabase.in"];
const SENSITIVE_QUERY_KEYS = ["access_token", "refresh_token", "code", "token", "type"];

function isAuthenticatedOrApiRequest(url) {
  return API_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))
    || SENSITIVE_QUERY_KEYS.some((key) => url.searchParams.has(key));
}

function isImmutableAsset(url) {
  return url.origin === self.location.origin
    && url.pathname.startsWith("/assets/")
    && /\.[a-zA-Z0-9_-]{8,}\.(js|css|woff2?|png|svg|webp)$/.test(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll([...PRECACHE, ...BUILD_ASSETS])));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("budgetforge-") && key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (isAuthenticatedOrApiRequest(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(SHELL_URL, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(SHELL_URL)) || caches.match(OFFLINE_URL))
    );
    return;
  }

  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      }))
    );
    return;
  }

  if (url.origin === self.location.origin && PRECACHE.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
