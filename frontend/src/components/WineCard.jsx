import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

const WineCard = ({ wine, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmDelete = () => {
    onDelete(wine.id)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/wines/${wine.id}`}
            className="block hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg text-neutral-900 mb-1">
              {wine.name}
            </h3>
          </Link>
          <p className="text-sm text-neutral-600">
            {wine.grape} - {wine.year}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-neutral-700">
            {wine.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Regiao</span>
          <span className="font-medium text-neutral-900">{wine.region}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Preco</span>
          <span className="font-medium text-neutral-900">
            R$ {wine.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Quantidade</span>
          <span className={`font-medium ${wine.quantity === 0 ? 'text-red-600' : 'text-neutral-900'}`}>
            {wine.quantity} {wine.quantity === 1 ? 'garrafa' : 'garrafas'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-neutral-100">
        <button
          onClick={() => onEdit(wine)}
          className="flex-1 btn-outline text-sm"
        >
          Editar
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex-1 btn-danger text-sm"
        >
          Excluir
        </button>
      </div>
    </div>

    <ConfirmDialog
      isOpen={showConfirm}
      title="Excluir Vinho"
      message={`Tem certeza que deseja excluir "${wine.name}"? Esta acao nao pode ser desfeita.`}
      confirmText="Excluir"
      cancelText="Cancelar"
      type="danger"
      onConfirm={handleConfirmDelete}
      onCancel={() => setShowConfirm(false)}
    />
    </>
  )
}

export default WineCard


