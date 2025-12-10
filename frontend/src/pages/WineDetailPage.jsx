import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useWine, useDeleteWine } from '../hooks/useWines'
import { useToastStore } from '../stores/toastStore'
import Skeleton from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmDialog from '../components/ConfirmDialog'

const WineDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: wine, isLoading, error, refetch } = useWine(id)
  const deleteWine = useDeleteWine()
  const addToast = useToastStore((state) => state.addToast)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setShowConfirm(false)

    try {
      await deleteWine.mutateAsync(id)
      addToast('Vinho excluido com sucesso!', 'success')
      navigate('/')
    } catch (error) {
      addToast(error.message || 'Erro ao excluir vinho', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton variant="text" className="w-32 mb-4" />
        </div>
        <div className="card p-8">
          <Skeleton variant="title" className="mb-4" />
          <Skeleton variant="text" className="mb-8" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton variant="text" className="h-20" />
            <Skeleton variant="text" className="h-20" />
            <Skeleton variant="text" className="h-20" />
            <Skeleton variant="text" className="h-20" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage message={error.message} onRetry={refetch} />
      </div>
    )
  }

  if (!wine) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage message="Vinho nao encontrado" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-neutral-600 hover:text-primary mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Voltar
      </Link>

      <div className="card p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {wine.name}
            </h1>
            <div className="flex items-center gap-4 text-neutral-600">
              <span>{wine.grape}</span>
              <span>-</span>
              <span>{wine.year}</span>
              <span>-</span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{wine.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/?edit=${wine.id}`)}
              className="btn-outline"
            >
              Editar
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-danger"
              disabled={deleteWine.isPending}
            >
              {deleteWine.isPending ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-50 rounded-xl">
            <div className="text-sm text-neutral-600 mb-1">Regiao</div>
            <div className="text-xl font-semibold text-neutral-900">
              {wine.region}
            </div>
          </div>

          <div className="p-6 bg-neutral-50 rounded-xl">
            <div className="text-sm text-neutral-600 mb-1">Preco</div>
            <div className="text-xl font-semibold text-neutral-900">
              R$ {wine.price.toFixed(2)}
            </div>
          </div>

          <div className="p-6 bg-neutral-50 rounded-xl">
            <div className="text-sm text-neutral-600 mb-1">Quantidade</div>
            <div className={`text-xl font-semibold ${wine.quantity === 0 ? 'text-red-600' : 'text-neutral-900'}`}>
              {wine.quantity} {wine.quantity === 1 ? 'garrafa' : 'garrafas'}
            </div>
          </div>

          <div className="p-6 bg-neutral-50 rounded-xl">
            <div className="text-sm text-neutral-600 mb-1">Avaliacao</div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-semibold text-neutral-900">
                {wine.rating.toFixed(1)}
              </div>
              <div className="text-neutral-500">/ 5.0</div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Excluir Vinho"
        message={`Tem certeza que deseja excluir "${wine.name}"? Esta acao nao pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

export default WineDetailPage


