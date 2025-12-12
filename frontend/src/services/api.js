import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  // Pegar token da store
  const token = useAuthStore.getState().getAccessToken()
  const user = useAuthStore.getState().user
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // TEMPORÁRIO: adicionar x-user-id para compatibilidade
  if (user?.id) {
    config.headers['x-user-id'] = user.id
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
        window.location.href = '/#/login'
      }
    }
    
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject(new Error(message))
  }
)

export default api

