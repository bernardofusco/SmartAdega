import api from './api'

export const analyzeWineImage = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await api.post('/recognition/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'accept': 'application/json'
    }
  })

  return response.data
}

export const isWineRecognized = (wineData) => {
  if (!wineData) return false
  
  const hasName = wineData.nome_do_vinho && wineData.nome_do_vinho.trim() !== ''
  const hasRegion = wineData.regiao && wineData.regiao.trim() !== ''
  const hasYear = wineData.ano && wineData.ano.toString().trim() !== ''
  
  return hasName || hasRegion || hasYear
}
