import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useToastStore } from '../stores/toastStore'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const addToast = useToastStore((state) => state.addToast)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      queryClient.clear()
      addToast('Logout realizado com sucesso', 'success')
      navigate('/login')
    } catch (error) {
      addToast('Erro ao fazer logout', 'error')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface-primary border-t border-base-surface dark:border-dark-surface-border h-16 flex justify-around items-center z-50">
      <Link 
        to="/" 
        className={`font-inter transition-colors ${
          isActive('/') ? 'text-wine-700 dark:text-dark-wine-primary' : 'text-text-muted dark:text-dark-text-muted hover:text-wine-700 dark:hover:text-dark-wine-primary'
        }`}
      >
        Adega
      </Link>
      <Link 
        to="/settings" 
        className={`font-inter transition-colors ${
          isActive('/settings') ? 'text-wine-700 dark:text-dark-wine-primary' : 'text-text-muted dark:text-dark-text-muted hover:text-wine-700 dark:hover:text-dark-wine-primary'
        }`}
      >
        Configurações
      </Link>
      <button
        onClick={handleLogout}
        className="font-inter text-text-muted dark:text-dark-text-muted hover:text-wine-700 dark:hover:text-dark-wine-primary transition-colors"
      >
        Sair
      </button>
    </nav>
  )
}
