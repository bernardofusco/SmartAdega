export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const DEFAULT_USER_ID = import.meta.env.VITE_USER_ID || 'default-user-123'

export const QUERY_KEYS = {
  WINES: 'wines',
  WINE: 'wine'
}

export const TOAST_DURATION = 4000

export const RATING_MIN = 0
export const RATING_MAX = 5

export const YEAR_MIN = 1900
export const YEAR_MAX = new Date().getFullYear() + 1

export const ROUTES = {
  HOME: '/',
  WINES: '/wines',
  WINE_DETAIL: '/wines/:id',
  SETTINGS: '/settings'
}

export const MESSAGES = {
  CREATE_SUCCESS: 'Vinho criado com sucesso!',
  UPDATE_SUCCESS: 'Vinho atualizado com sucesso!',
  DELETE_SUCCESS: 'Vinho excluido com sucesso!',
  CREATE_ERROR: 'Erro ao criar vinho',
  UPDATE_ERROR: 'Erro ao atualizar vinho',
  DELETE_ERROR: 'Erro ao excluir vinho',
  LOAD_ERROR: 'Erro ao carregar dados',
  DELETE_CONFIRM: 'Tem certeza que deseja excluir este vinho?'
}

