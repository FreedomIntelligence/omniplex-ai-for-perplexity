const CACHE_NAME = 'omniplex-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/Logo.png',
  '/Apple-Icon.png',
  '/OGImage.png',
  '/favicon.ico',
  '/lottie/Audio.json',
  '/lottie/Love.json',
  '/svgs/Arrow.svg',
  '/svgs/Bin.svg',
  '/svgs/Check.svg',
  '/svgs/Clip.svg',
  '/svgs/Copy.svg',
  '/svgs/Cross.svg',
  '/svgs/CrossRed.svg',
  '/svgs/CrossWhite.svg',
  '/svgs/Doc.svg',
  '/svgs/File.svg',
  '/svgs/FileActive.svg',
  '/svgs/Filter.svg',
  '/svgs/Folder.svg',
  '/svgs/Fork.svg',
  '/svgs/Google.svg',
  '/svgs/Info.svg',
  '/svgs/Link.svg',
  '/svgs/Menu.svg',
  '/svgs/NextArrow.svg',
  '/svgs/Pen.svg',
  '/svgs/Picture.svg',
  '/svgs/Play.svg',
  '/svgs/Plus.svg',
  '/svgs/PrevArrow.svg',
  '/svgs/Redirect.svg',
  '/svgs/Retry.svg',
  '/svgs/Return.svg',
  '/svgs/Rewrite.svg',
  '/svgs/Selector.svg',
  '/svgs/Share.svg',
  '/svgs/Source.svg',
  '/svgs/Stop.svg',
  '/svgs/User.svg',
  '/svgs/Video.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});