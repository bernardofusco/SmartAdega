import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from './Input'
import Button from './Button'
import ModalConfirmImage from './ModalConfirmImage'
import { analyzeWineImage, isWineRecognized } from '../services/recognitionService'
import { useWineRecognitionStore } from '../stores/wineRecognitionStore'
import { useToastStore } from '../stores/toastStore'

const wineSchema = z.object({
  name: z.string().min(1, 'Informe o nome do vinho'),
  grape: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  year: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return Number(val)
    },
    z.number({ invalid_type_error: 'Informe o ano' })
      .int('Ano deve ser um numero inteiro')
      .min(1900, 'Ano invalido')
      .max(new Date().getFullYear() + 1, 'Ano invalido')
  ),
  price: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return ''
      return Number(val)
    },
    z.union([
      z.number().nonnegative('Preco nao pode ser negativo'),
      z.literal('')
    ])
  ),
  rating: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return ''
      return Number(val)
    },
    z.union([
      z.number()
        .min(0, 'Avaliacao deve ser entre 0 e 5')
        .max(5, 'Avaliacao deve ser entre 0 e 5'),
      z.literal('')
    ])
  ),
  quantity: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined
      return Number(val)
    },
    z.number({ invalid_type_error: 'Informe a quantidade' })
      .int('Quantidade deve ser um numero inteiro')
      .positive('A quantidade deve ser maior que zero')
  )
})

const WineForm = ({ wine, onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [globalError, setGlobalError] = useState('')
  
  const [wineData, setWineData] = useState({
    name: '',
    grape: '',
    region: '',
    year: '',
    price: '',
    quantity: '',
    rating: ''
  })
  
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  
  const addToast = useToastStore((state) => state.addToast)
  const { recognizedData, setRecognizedData, clearRecognitionData } = useWineRecognitionStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(wineSchema),
    defaultValues: wine || {
      name: '',
      grape: '',
      region: '',
      year: '',
      price: '',
      rating: '',
      quantity: ''
    }
  })

  const formValues = watch()

  useEffect(() => {
    if (recognizedData) {
      if (recognizedData.nome_do_vinho && recognizedData.nome_do_vinho.trim() !== '') {
        setValue('name', recognizedData.nome_do_vinho)
        setWineData(prev => ({ ...prev, name: recognizedData.nome_do_vinho }))
      }
      if (recognizedData.uva && recognizedData.uva.trim() !== '') {
        setValue('grape', recognizedData.uva)
        setWineData(prev => ({ ...prev, grape: recognizedData.uva }))
      }
      if (recognizedData.regiao && recognizedData.regiao.trim() !== '') {
        setValue('region', recognizedData.regiao)
        setWineData(prev => ({ ...prev, region: recognizedData.regiao }))
      }
      if (recognizedData.ano && recognizedData.ano.toString().trim() !== '') {
        setValue('year', parseInt(recognizedData.ano))
        setWineData(prev => ({ ...prev, year: recognizedData.ano.toString() }))
      }
      if (recognizedData.preco && recognizedData.preco.toString().trim() !== '') {
        setValue('price', parseFloat(recognizedData.preco))
        setWineData(prev => ({ ...prev, price: recognizedData.preco.toString() }))
      }
      if (recognizedData.quantidade && recognizedData.quantidade.toString().trim() !== '') {
        setValue('quantity', parseInt(recognizedData.quantidade))
        setWineData(prev => ({ ...prev, quantity: recognizedData.quantidade.toString() }))
      }
      if (recognizedData.avaliacao && recognizedData.avaliacao.toString().trim() !== '') {
        setValue('rating', parseFloat(recognizedData.avaliacao))
        setWineData(prev => ({ ...prev, rating: recognizedData.avaliacao.toString() }))
      }
    }
  }, [recognizedData, setValue])

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setImageFile(file)
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmImage = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    
    try {
      const result = await analyzeWineImage(imageFile)
      
      if (isWineRecognized(result)) {
        setRecognizedData(result)
        setIsModalOpen(false)
        setActiveTab('manual')
        addToast('Vinho reconhecido com sucesso!', 'success')
      } else {
        setIsModalOpen(false)
        setSelectedImage(null)
        setImageFile(null)
        addToast('Nao conseguimos identificar esse vinho. Tente outra imagem.', 'warning')
      }
    } catch (error) {
      console.error('Erro ao analisar imagem:', error)
      setIsModalOpen(false)
      addToast('Erro ao processar imagem. Tente novamente.', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCancelImage = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    setImageFile(null)
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

  const handleFormSubmit = async (data) => {
    setGlobalError('')
    
    try {
      await onSubmit(data)
    } catch (error) {
      setGlobalError(error.message || 'Erro ao salvar vinho')
      console.error('Erro ao submeter formulario:', error)
    }
  }

  const tabs = [
    { id: 'upload', label: 'Upload' },
    { id: 'link', label: 'Link' },
    { id: 'manual', label: 'Manual' }
  ]

  return (
    <div>
      <ModalConfirmImage
        isOpen={isModalOpen}
        imagePreview={selectedImage}
        onConfirm={handleConfirmImage}
        onCancel={handleCancelImage}
        isLoading={isAnalyzing}
      />
      
      <div className="flex border-b border-gray-200 dark:border-dark-surface-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-inter font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-wine-700 dark:text-dark-wine-primary border-b-2 border-wine-700 dark:border-dark-wine-primary'
                : 'text-text-muted dark:text-dark-text-muted hover:text-text-main dark:hover:text-dark-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {globalError && (
            <div className="bg-red-100 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 py-3 px-4 rounded-md mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-inter font-medium text-sm">
                    {globalError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {Object.keys(errors).length > 0 && !globalError && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 py-3 px-4 rounded-md mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-inter font-medium text-sm">
                    Existem erros no formulario. Corrija os campos destacados.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-text-main dark:text-dark-text-primary text-sm font-inter font-medium mb-2 block">
              Nome do Vinho <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder={formValues.name ? '' : 'Ex: Chateau Margaux'}
              className={`
                w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                text-gray-900 dark:text-dark-text-primary font-inter
                placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                focus:outline-none focus:ring-2
                transition-all
                ${errors.name 
                  ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                  : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                }
              `}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1.5 font-inter flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-text-main dark:text-dark-text-primary text-sm font-inter font-medium mb-2 block">
                Uva
              </label>
              <input
                type="text"
                {...register('grape')}
                placeholder={formValues.grape ? '' : 'Ex: Cabernet Sauvignon'}
                className={`
                  w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                  text-gray-900 dark:text-dark-text-primary font-inter
                  placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                  focus:outline-none focus:ring-2
                  transition-all
                  ${errors.grape 
                    ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                    : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                  }
                `}
              />
              {errors.grape && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.grape.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-text-main dark:text-dark-text-primary text-sm font-inter font-medium mb-2 block">
                Regiao
              </label>
              <input
                type="text"
                {...register('region')}
                placeholder={formValues.region ? '' : 'Ex: Bordeaux, Franca'}
                className={`
                  w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                  text-gray-900 dark:text-dark-text-primary font-inter
                  placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                  focus:outline-none focus:ring-2
                  transition-all
                  ${errors.region 
                    ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                    : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                  }
                `}
              />
              {errors.region && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.region.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-text-main text-sm font-inter font-medium mb-2 block">
                Ano <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register('year')}
                placeholder={formValues.year ? '' : 'Ex: 2019'}
                className={`
                  w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                  text-gray-900 dark:text-dark-text-primary font-inter
                  placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                  focus:outline-none focus:ring-2
                  transition-all
                  ${errors.year 
                    ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                    : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                  }
                `}
              />
              {errors.year && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.year.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-text-main dark:text-dark-text-primary text-sm font-inter font-medium mb-2 block">
                Preco (R$)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                placeholder={formValues.price ? '' : 'Ex: 199.90'}
                className={`
                  w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                  text-gray-900 dark:text-dark-text-primary font-inter
                  placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                  focus:outline-none focus:ring-2
                  transition-all
                  ${errors.price 
                    ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                    : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                  }
                `}
              />
              {errors.price && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-text-main text-sm font-inter font-medium mb-2 block">
                Quantidade <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register('quantity')}
                placeholder={formValues.quantity ? '' : 'Ex: 6'}
                className={`
                  w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                  text-gray-900 dark:text-dark-text-primary font-inter
                  placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                  focus:outline-none focus:ring-2
                  transition-all
                  ${errors.quantity 
                    ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                    : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                  }
                `}
              />
              {errors.quantity && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-text-main dark:text-dark-text-primary text-sm font-inter font-medium mb-2 block">
              Avaliacao (0 a 5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register('rating')}
              placeholder={formValues.rating ? '' : 'Ex: 4.5'}
              className={`
                w-full bg-white dark:bg-dark-surface-secondary border rounded-md h-11 px-3
                text-gray-900 dark:text-dark-text-primary font-inter
                placeholder:text-gray-400 dark:placeholder:text-dark-text-muted
                focus:outline-none focus:ring-2
                transition-all
                ${errors.rating 
                  ? 'border-red-500 dark:border-red-600 focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-400/30' 
                  : 'border-gray-300 dark:border-dark-surface-border focus:border-wine-700 dark:focus:border-dark-wine-primary focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30'
                }
              `}
            />
            {errors.rating && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 font-inter flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.rating.message}
              </p>
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
                  Imagem selecionada
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null)
                    setImageFile(null)
                  }}
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
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WineForm

