const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null

  const buttonClass = type === 'danger' ? 'btn-danger' : 'btn-primary'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onCancel}
        />
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {title}
            </h3>
            <p className="text-neutral-600">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn-outline flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`${buttonClass} flex-1`}
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

