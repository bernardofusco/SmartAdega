const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-48 w-full',
    button: 'h-10 w-24',
    circle: 'h-12 w-12 rounded-full'
  }

  return <div className={`animate-pulse bg-base-surface rounded ${variants[variant]} ${className}`} />
}

export const WineCardSkeleton = () => {
  return (
    <div className="bg-white shadow-soft rounded-lg p-4 flex gap-4">
      <div className="w-16 h-24 bg-base-surface rounded-md animate-pulse" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="text" className="w-1/3" />
        <div className="flex gap-2 mt-3">
          <Skeleton variant="button" className="flex-1" />
          <Skeleton variant="button" className="flex-1" />
        </div>
      </div>
    </div>
  )
}

export const WineListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <WineCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton

