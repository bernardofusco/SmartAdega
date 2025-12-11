import { useState, useMemo } from 'react'
import { useWines, useDeleteWine } from '../hooks/useWines'
import { useToastStore } from '../stores/toastStore'
import WineList from '../components/WineList'
import Modal from '../components/Modal'
import WineForm from '../components/WineForm'
import WineSortSelect from '../components/WineSortSelect'
import { useCreateWine, useUpdateWine } from '../hooks/useWines'

const WinesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWine, setEditingWine] = useState(null)
  const [sortOption, setSortOption] = useState('name_asc')

  const { data: wines, isLoading, error, refetch } = useWines()
  const createWine = useCreateWine()
  const updateWine = useUpdateWine()
  const deleteWine = useDeleteWine()
  const addToast = useToastStore((state) => state.addToast)

  const sortedWines = useMemo(() => {
    if (!wines || !Array.isArray(wines)) {
      return []
    }

    const winesCopy = [...wines]

    const sortFunctions = {
      name_asc: (a, b) => {
        const nameA = (a.name || '').toLowerCase()
        const nameB = (b.name || '').toLowerCase()
        return nameA.localeCompare(nameB)
      },
      name_desc: (a, b) => {
        const nameA = (a.name || '').toLowerCase()
        const nameB = (b.name || '').toLowerCase()
        return nameB.localeCompare(nameA)
      },
      price_asc: (a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      },
      price_desc: (a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceB - priceA
      },
      year_desc: (a, b) => {
        const yearA = a.year || 0
        const yearB = b.year || 0
        return yearB - yearA
      },
      year_asc: (a, b) => {
        const yearA = a.year || 0
        const yearB = b.year || 0
        return yearA - yearB
      }
    }

    const sortFn = sortFunctions[sortOption]
    if (sortFn) {
      winesCopy.sort(sortFn)
    }

    return winesCopy
  }, [wines, sortOption])

  const handleOpenModal = (wine = null) => {
    setEditingWine(wine)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingWine(null)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingWine) {
        await updateWine.mutateAsync({
          id: editingWine.id,
          data
        })
        addToast('Vinho atualizado com sucesso!', 'success')
      } else {
        await createWine.mutateAsync(data)
        addToast('Vinho criado com sucesso!', 'success')
      }
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar vinho:', error)
      const errorMessage = error.message || error.response?.data?.error || error.response?.data?.message || 'Erro ao salvar vinho'
      addToast(errorMessage, 'error')
      throw error
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteWine.mutateAsync(id)
      addToast('Vinho excluido com sucesso!', 'success')
    } catch (error) {
      addToast(error.message || 'Erro ao excluir vinho', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins text-2xl text-wine-700 dark:text-dark-wine-primary mb-1">
          Minha Adega
        </h1>
        <p className="text-sm text-text-muted dark:text-dark-text-muted font-inter">
          {wines?.length || 0} {wines?.length === 1 ? 'vinho cadastrado' : 'vinhos cadastrados'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <WineSortSelect value={sortOption} onChange={setSortOption} />
        
        <button
          onClick={() => handleOpenModal()}
          className="bg-wine-700 text-white hover:bg-wine-500 dark:bg-dark-wine-primary dark:hover:bg-dark-wine-secondary px-4 py-2 h-11 rounded-md font-inter font-medium transition-all flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar
        </button>
      </div>

      <WineList
        wines={sortedWines}
        isLoading={isLoading}
        error={error}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        onRetry={refetch}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWine ? 'Editar Vinho' : 'Adicionar Vinho'}
      >
        <WineForm
          wine={editingWine}
          onSubmit={handleSubmit}
          isLoading={createWine.isPending || updateWine.isPending}
        />
      </Modal>
    </div>
  )
}

export default WinesPage

