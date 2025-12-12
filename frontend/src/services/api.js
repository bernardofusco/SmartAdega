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
  (error) => {
    // Se receber 401, limpar autenticação
    if (error.response?.status === 401) {
      const message = error.response?.data?.error || ''
      // Evitar redirect em loop
      if (!window.location.hash.includes('/login')) {
        useAuthStore.getState().clearAuth()
        // Usar hash redirect para manter o base path do Vite
        window.location.hash = '#/login'
      }
    }
    
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject(new Error(message))
  }
)

export default api

