import api from './api'

export const wineService = {
  getAll: async () => {
    const { data } = await api.get('/wines')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/wines/${id}`)
    return data
  },

  create: async (wineData) => {
    const dataWithUserId = {
      ...wineData,
      user_id: import.meta.env.VITE_USER_ID
    }
    const { data } = await api.post('/wines', dataWithUserId)
    return data
  },

  update: async (id, wineData) => {
    const { data } = await api.put(`/wines/${id}`, wineData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/wines/${id}`)
    return data
  }
}

