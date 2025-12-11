import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

const WineCard = ({ wine, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowConfirm(true)
  }

  const handleEditClick = () => {
    setShowMenu(false)
    onEdit(wine)
  }

  const handleConfirmDelete = () => {
    onDelete(wine.id)
    setShowConfirm(false)
  }

  const handleCardClick = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      menuRef.current?.contains(e.target)
    ) {
      return
    }
    setIsOpen(true)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white shadow-soft rounded-lg p-4 relative cursor-pointer hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-24 bg-base-surface rounded-md flex-shrink-0" />

          <div className="flex flex-col flex-1 relative">
            <div className="flex items-start justify-between mb-1">
              <Link 
                to={`/wines/${wine.id}`}
                className="block hover:opacity-80 transition-opacity flex-1"
              >
                <h3 className="font-poppins text-lg text-text-main">
                  {wine.name}
                </h3>
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-base-surface rounded-md transition-colors"
                  aria-label="Menu de opcoes"
                >
                  <svg
                    className="w-5 h-5 text-text-muted"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <circle cx="8" cy="2" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="14" r="1.5" />
                  </svg>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[140px]">
                    <button
                      onClick={handleEditClick}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-base-surface transition-colors flex items-center gap-2 text-text-main font-inter"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-base-surface transition-colors flex items-center gap-2 text-red-600 font-inter"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-text-muted font-inter">
              {wine.grape} - {wine.year}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="bg-gold-300 text-wine-700 px-2 py-1 rounded-full text-xs font-inter">
                {wine.type || 'Tinto'}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-text-main font-inter">
                  {wine.rating ? wine.rating.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-base-surface pt-3 mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted font-inter">Regiao</span>
            <span className="text-sm text-text-main font-inter font-medium">{wine.region}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted font-inter">Preco</span>
            <span className="text-sm text-text-main font-inter font-medium">
              R$ {wine.price ? wine.price.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted font-inter">Quantidade</span>
            <span className={`text-sm font-inter font-medium ${wine.quantity === 0 ? 'text-red-600' : 'text-text-main'}`}>
              {wine.quantity || 0} {wine.quantity === 1 ? 'garrafa' : 'garrafas'}
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-all duration-300"
        >
          <div className="bg-white shadow-2xl rounded-lg p-6 relative max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-base-surface rounded-full transition-colors"
              aria-label="Fechar"
            >
              <svg
                className="w-6 h-6 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex gap-6 mb-6">
              <div className="w-32 h-48 bg-base-surface rounded-md flex-shrink-0" />

              <div className="flex flex-col flex-1">
                <h3 className="font-poppins text-2xl text-text-main mb-2">
                  {wine.name}
                </h3>
                <p className="text-base text-text-muted font-inter mb-3">
                  {wine.grape} - {wine.year}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gold-300 text-wine-700 px-3 py-1 rounded-full text-sm font-inter">
                    {wine.type || 'Tinto'}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-base font-medium text-text-main font-inter">
                      {wine.rating ? wine.rating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-base-surface rounded-md">
              <h4 className="font-poppins text-lg text-text-main mb-3">Descricao</h4>
              <p className="text-sm text-text-muted font-inter leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="border-t border-base-surface pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base text-text-muted font-inter">Regiao</span>
                <span className="text-base text-text-main font-inter font-medium">{wine.region}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-text-muted font-inter">Preco</span>
                <span className="text-base text-text-main font-inter font-medium">
                  R$ {wine.price ? wine.price.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-text-muted font-inter">Quantidade</span>
                <span className={`text-base font-inter font-medium ${wine.quantity === 0 ? 'text-red-600' : 'text-text-main'}`}>
                  {wine.quantity || 0} {wine.quantity === 1 ? 'garrafa' : 'garrafas'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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


