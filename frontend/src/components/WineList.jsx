import WineCard from './WineCard'
import { WineListSkeleton } from './Skeleton'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'

const WineList = ({ wines, isLoading, error, onEdit, onDelete, onRetry }) => {
  if (isLoading) {
    return <WineListSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={onRetry} />
  }

  if (!wines || !Array.isArray(wines) || wines.length === 0) {
    return (
      <EmptyState
        title="Nenhum vinho cadastrado"
        message="Comece adicionando o primeiro vinho da sua colecao"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wines.map((wine) => (
        <WineCard
          key={wine.id}
          wine={wine}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default WineList

