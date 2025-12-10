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
      <div className="bg-white shadow-soft rounded-lg p-4 flex gap-4">
        <div className="w-16 h-24 bg-base-surface rounded-md" />

        <div className="flex flex-col flex-1">
          <Link 
            to={`/wines/${wine.id}`}
            className="block hover:opacity-80 transition-opacity"
          >
            <h3 className="font-poppins text-lg text-text-main">
              {wine.name}
            </h3>
          </Link>
          <p className="text-sm text-text-muted">{wine.grape}</p>
          <p className="text-sm text-text-muted">{wine.year}</p>

          <span className="mt-2 bg-gold-300 text-wine-700 px-2 py-1 rounded-full text-xs font-inter w-fit">
            {wine.type || 'Tinto'}
          </span>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(wine)}
              className="flex-1 border border-wine-700 text-wine-700 bg-transparent hover:bg-wine-700 hover:text-white px-3 py-1.5 rounded-md text-sm font-inter transition-all"
            >
              Editar
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-inter transition-all"
            >
              Excluir
            </button>
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
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}

export default WineCard


