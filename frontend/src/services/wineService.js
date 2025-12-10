import api from './api'

export const wineService = {
  getAll: async () => {
    const { data } = await api.get('/wines', {
      params: {
        user_id: import.meta.env.VITE_USER_ID
      }
    })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/wines/${id}`)
    return data
  },

  create: async (wineData) => {
    const payload = {
      ...wineData,
      user_id: import.meta.env.VITE_USER_ID
    }
    const { data } = await api.post('/wines', payload)
    return data
  },

  update: async (id, wineData) => {
    const payload = {
      ...wineData,
      user_id: import.meta.env.VITE_USER_ID
    }
    const { data } = await api.put(`/wines/${id}`, payload)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/wines/${id}`, {
      data: {
        user_id: import.meta.env.VITE_USER_ID
      }
    })
    return data
  }
}

