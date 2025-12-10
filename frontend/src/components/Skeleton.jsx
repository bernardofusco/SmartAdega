const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-48 w-full',
    button: 'h-10 w-24',
    circle: 'h-12 w-12 rounded-full'
  }

  return <div className={`skeleton ${variants[variant]} ${className}`} />
}

export const WineCardSkeleton = () => {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="title" className="mb-2" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="circle" />
      </div>
      
      <div className="space-y-3">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-3/4" />
      </div>

      <div className="flex gap-2 mt-6">
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="flex-1" />
      </div>
    </div>
  )
}

export const WineListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <WineCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton

