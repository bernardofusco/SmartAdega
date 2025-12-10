export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatYear = (year) => {
  return year.toString()
}

export const formatRating = (rating) => {
  return rating.toFixed(1)
}

export const getQuantityLabel = (quantity) => {
  return quantity === 1 ? 'garrafa' : 'garrafas'
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

