const CACHE_NAME = 'smartadega-v1'
const urlsToCache = [
  '/',
  '/index.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // NÃO cachear requisições de API (evita vazamento entre usuários)
  if (url.pathname.startsWith('/api/') || 
      url.hostname.includes('supabase.co') ||
      url.hostname.includes('localhost:3000')) {
    event.respondWith(fetch(event.request))
    return
  }
  
  // Cachear apenas assets estáticos (HTML, CSS, JS, imagens)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
