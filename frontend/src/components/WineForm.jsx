import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from './Input'
import Button from './Button'

const wineSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  grape: z.string().min(1, 'Uva e obrigatoria'),
  region: z.string().min(1, 'Regiao e obrigatoria'),
  year: z.coerce.number().int().min(1900, 'Ano invalido').max(new Date().getFullYear() + 1, 'Ano invalido'),
  price: z.coerce.number().positive('Preco deve ser positivo'),
  rating: z.coerce.number().min(0, 'Rating minimo e 0').max(5, 'Rating maximo e 5'),
  quantity: z.coerce.number().int().min(0, 'Quantidade nao pode ser negativa')
})

const WineForm = ({ wine, onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(wineSchema),
    defaultValues: wine || {
      name: '',
      grape: '',
      region: '',
      year: new Date().getFullYear(),
      price: 0,
      rating: 0,
      quantity: 0
    }
  })

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageSelect(file)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleImageSelect(file)
  }

  const tabs = [
    { id: 'upload', label: 'Upload' },
    { id: 'link', label: 'Link' },
    { id: 'manual', label: 'Manual' }
  ]

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-inter font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-wine-700 border-b-2 border-wine-700'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Nome do Vinho"
          type="text"
          placeholder="Ex: Chateau Margaux"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Uva"
            type="text"
            placeholder="Ex: Cabernet Sauvignon"
            {...register('grape')}
          />
          {errors.grape && (
            <p className="text-red-600 text-sm mt-1">{errors.grape.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Regiao"
            type="text"
            placeholder="Ex: Bordeaux"
            {...register('region')}
          />
          {errors.region && (
            <p className="text-red-600 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Ano"
            type="number"
            placeholder="2020"
            {...register('year')}
          />
          {errors.year && (
            <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Preco (R$)"
            type="number"
            step="0.01"
            placeholder="199.90"
            {...register('price')}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Quantidade"
            type="number"
            placeholder="6"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          label="Avaliacao (0 a 5)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="4.5"
          {...register('rating')}
        />
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Salvando...' : wine ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
      )}

      {activeTab === 'link' && (
        <div className="space-y-4">
          <div>
            <Input
              label="Link da Imagem"
              type="url"
              placeholder="https://exemplo.com/vinho.jpg"
            />
          </div>
          <div>
            <Input
              label="Link de Informacoes"
              type="url"
              placeholder="https://exemplo.com/detalhes"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" className="flex-1">
              Buscar Dados
            </Button>
          </div>
          <p className="text-sm text-text-muted text-center">
            Funcionalidade em desenvolvimento
          </p>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-wine-700 bg-purple-50'
                : 'border-gray-300 hover:border-wine-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-inter font-medium text-text-main mb-1">
                  Arraste a imagem do vinho aqui
                </p>
                <p className="text-sm text-text-muted">
                  ou selecione abaixo
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Tirar Foto
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Escolher da Galeria
            </Button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {selectedImage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-inter font-medium text-text-main">
                  Preview da imagem:
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-sm text-wine-700 hover:text-wine-500 font-inter"
                >
                  Remover
                </button>
              </div>
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="primary" className="flex-1">
                  Processar Imagem
                </Button>
              </div>
              <p className="text-sm text-text-muted text-center">
                Funcionalidade em desenvolvimento
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WineForm

