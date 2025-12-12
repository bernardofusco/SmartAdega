import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  // Pegar token da store (agora persistido)
  const token = useAuthStore.getState().getAccessToken()
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se receber 401, limpar autenticação completamente
    if (error.response?.status === 401) {
      // Evitar redirect em loop
      if (!window.location.hash.includes('/login')) {
        console.log('🚨 401 detectado. Limpando sessão completa...')
        
        // Limpar store do Zustand
        useAuthStore.getState().clearAuth()
        
        // Limpar localStorage do auth-storage
        localStorage.removeItem('auth-storage')
        
        // Limpar todos os tokens do Supabase (sb-*)
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key)
          }
        })
        
        // Fazer logout no Supabase
        try {
          const { supabase } = await import('../config/supabase')
          await supabase.auth.signOut()
        } catch (err) {
          console.error('Erro ao fazer signOut no Supabase:', err)
        }
        
        // Redirecionar para login
        window.location.hash = '#/login'
      }
    }
    
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject(new Error(message))
  }
)

export default api

