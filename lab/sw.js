
const CACHE = "kymaia-lessons-ea212fe50ec3-20a7cece20c610be";
const PREFIX = "kymaia-lessons-ea212fe50ec3-";
const FILES = ["/kym-chem/lab/","/kym-chem/lab/index.html","/kym-chem/lab/manifest.webmanifest","/kym-chem/lab/icon.svg","/kym-chem/lab/assets/chapters-BxrAHJFO.js","/kym-chem/lab/assets/chapters-DA3SWNai.css","/kym-chem/lab/assets/index-CUz-ahDh.css","/kym-chem/lab/assets/index-Cbe2mllZ.js","/kym-chem/lab/assets/rolldown-runtime-XKyaHtl9.js","/kym-chem/lab/assets/three--DnbfA6K.js","/kym-chem/lab/assets/vendor-DYD7VS3l.js"];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
// Updates wait for old app tabs to close, preserving drafts.
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!FILES.includes(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  return (await cache.match(url.pathname))||fetch(event.request);
 })());
});
