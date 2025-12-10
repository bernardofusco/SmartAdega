import { useState } from 'react'
import { useWines, useDeleteWine } from '../hooks/useWines'
import { useToastStore } from '../stores/toastStore'
import WineList from '../components/WineList'
import Modal from '../components/Modal'
import WineForm from '../components/WineForm'
import { useCreateWine, useUpdateWine } from '../hooks/useWines'

const WinesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWine, setEditingWine] = useState(null)

  const { data: wines, isLoading, error, refetch } = useWines()
  const createWine = useCreateWine()
  const updateWine = useUpdateWine()
  const deleteWine = useDeleteWine()
  const addToast = useToastStore((state) => state.addToast)

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
      addToast(error.message || 'Erro ao salvar vinho', 'error')
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Minha Colecao
          </h1>
          <p className="text-neutral-600">
            {wines?.length || 0} {wines?.length === 1 ? 'vinho' : 'vinhos'} cadastrados
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Adicionar Vinho
        </button>
      </div>

      <WineList
        wines={Array.isArray(wines) ? wines : []}
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

