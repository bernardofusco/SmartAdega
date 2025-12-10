import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId') || import.meta.env.VITE_USER_ID || 'default-user-123'
  config.headers['x-user-id'] = userId
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject(new Error(message))
  }
)

export default api

