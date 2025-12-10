const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null

  const confirmButtonClass = type === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white' 
    : 'bg-wine-700 text-white hover:bg-wine-500'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onCancel}
        />
        
        <div className="relative bg-white rounded-lg shadow-soft max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="font-poppins text-xl text-text-main mb-2">
              {title}
            </h3>
            <p className="font-inter text-text-muted">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="border border-wine-700 text-wine-700 bg-transparent hover:bg-wine-700 hover:text-white px-4 py-2 h-11 rounded-md font-inter font-medium transition-all flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`${confirmButtonClass} px-4 py-2 h-11 rounded-md font-inter font-medium transition-all flex-1`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

