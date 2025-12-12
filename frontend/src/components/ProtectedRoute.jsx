import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from './Spinner'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  console.log('🛡️ ProtectedRoute:', { isAuthenticated, loading, hasUser: !!user })

  if (loading) {
    console.log('⏳ Aguardando autenticação...')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('❌ Não autenticado, redirecionando para login')
    // Redirecionar para login, salvando a rota de destino
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('✅ Autenticado, renderizando conteúdo protegido')
  return children
}

export default ProtectedRoute
