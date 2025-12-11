const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white dark:bg-dark-surface-elevated rounded-lg shadow-soft dark:shadow-dark-card max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:border dark:border-dark-surface-border">
          <div className="sticky top-0 bg-white dark:bg-dark-surface-elevated border-b border-gold-300 dark:border-dark-surface-border px-6 py-4 flex items-center justify-between">
            <h2 className="font-poppins text-xl text-text-main dark:text-dark-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted dark:text-dark-text-muted hover:text-wine-700 dark:hover:text-dark-wine-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

