// Service Worker desabilitado para evitar problemas com GitHub Pages
// O HashRouter já garante funcionamento offline básico

self.addEventListener('install', () => {
  // Não faz nada - apenas registra para desabilitar service workers antigos
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Remove todos os caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', () => {
  // Não intercepta requests - deixa o browser lidar com tudo
  return
})
