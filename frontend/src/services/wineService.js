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
      name: wineData.name || '',
      grape: wineData.grape || 'Nao informado',
      region: wineData.region || 'Nao informado',
      year: wineData.year || new Date().getFullYear(),
      price: wineData.price || 0.01,
      quantity: wineData.quantity || 0,
      rating: wineData.rating || 0
    }

    console.log('Payload enviado:', payload)

    try {
      const { data } = await api.post('/wines', payload)
      return data
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao criar vinho'
      console.error('Erro da API:', error.response?.data)
      throw new Error(errorMessage)
    }
  },

  update: async (id, wineData) => {
    const payload = {
      name: wineData.name || '',
      grape: wineData.grape || 'Nao informado',
      region: wineData.region || 'Nao informado',
      year: wineData.year || new Date().getFullYear(),
      price: wineData.price || 0.01,
      quantity: wineData.quantity || 0,
      rating: wineData.rating || 0
    }

    console.log('Payload enviado (update):', payload)

    try {
      const { data } = await api.put(`/wines/${id}`, payload)
      return data
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao atualizar vinho'
      console.error('Erro da API:', error.response?.data)
      throw new Error(errorMessage)
    }
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

