// Only shell assets. No catalog, API results, private data, or subscriptions are cached.
const CACHE = 'qfazer-shell-v3';
const ROOT = new URL('./', self.registration.scope);
const SHELL = ['./','./index.html','./app.css','./app.js','./catalog.js','./taxonomy.js','./manifest.webmanifest','./assets/logo-qfazer.svg','./assets/app-192.svg','./assets/app-512.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qfazer-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==ROOT.origin||url.pathname.includes('catalog-')||url.pathname.includes('/api/')||url.pathname.includes('/.netlify/'))return;if(req.mode==='navigate'){event.respondWith(fetch(req).catch(()=>caches.match('./index.html')));return;}if(SHELL.some(path=>new URL(path,ROOT).pathname===url.pathname)){event.respondWith(caches.match(req,{ignoreSearch:true}).then(cached=>cached||fetch(req)));}});
