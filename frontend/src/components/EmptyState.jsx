const EmptyState = ({ title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 max-w-md mb-6">
        {message}
      </p>
      
      {action && action}
    </div>
  )
}

export default EmptyState

