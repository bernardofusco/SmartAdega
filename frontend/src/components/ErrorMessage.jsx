const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
        Algo deu errado
      </h3>
      
      <p className="text-neutral-600 max-w-md mb-6">
        {message || 'Ocorreu um erro ao carregar os dados. Tente novamente.'}
      </p>
      
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

