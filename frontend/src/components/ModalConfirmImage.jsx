import { useState } from 'react'
import Button from './Button'
import Spinner from './Spinner'

const ModalConfirmImage = ({ 
  isOpen, 
  imagePreview, 
  onConfirm, 
  onCancel, 
  isLoading 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      <div className="relative bg-white dark:bg-dark-surface-elevated rounded-xl shadow-2xl dark:shadow-dark-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto dark:border dark:border-dark-surface-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-playfair font-bold text-wine-900 dark:text-dark-wine-primary">
              Confirmar Imagem
            </h2>
            {!isLoading && (
              <button
                onClick={onCancel}
                className="text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text-primary transition-colors"
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
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="large" />
              <p className="mt-4 text-lg font-inter text-text-main dark:text-dark-text-primary">
                Analisando imagem...
              </p>
              <p className="mt-2 text-sm text-text-muted dark:text-dark-text-muted">
                Estamos identificando o vinho. Isso pode levar alguns segundos.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Preview do vinho"
                  className="w-full h-96 object-contain rounded-lg border-2 border-gray-200 dark:border-dark-surface-border"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Enviar Outra Imagem
                </Button>
                <Button
                  variant="primary"
                  onClick={onConfirm}
                  className="flex-1"
                >
                  Confirmar Imagem
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmImage
