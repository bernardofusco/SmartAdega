import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './hooks/useAuth'
import { router } from './routes'
import { PWAInstallBanner } from './components/PWAInstallBanner'
import { PWADebugPanel } from './components/PWADebugPanel'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5
    }
  }
})

function AuthInitializer() {
  useAuth()
  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <RouterProvider router={router} />
      <PWAInstallBanner />
      <PWADebugPanel />
    </QueryClientProvider>
  )
}

export default App

