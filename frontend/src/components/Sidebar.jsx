import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useToastStore } from '../stores/toastStore'

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const addToast = useToastStore((state) => state.addToast)

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const toggleDesktopSidebar = () => {
    setIsDesktopExpanded(!isDesktopExpanded)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  // Ícones SVG
  const WineIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const LogoutIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  const handleLogout = async () => {
    try {
      await authService.signOut()
      queryClient.clear()
      addToast('Logout realizado com sucesso', 'success')
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      addToast('Erro ao fazer logout', 'error')
    }
  }

  return (
    <>
      {/* Barra superior mobile com botão toggle */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-dark-surface-primary border-b border-base-surface dark:border-dark-surface-border z-50 md:hidden flex items-center px-4">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg hover:bg-base-surface dark:hover:bg-dark-surface-secondary transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-text-primary dark:text-dark-text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-14 md:top-0 left-0 h-[calc(100vh-3.5rem)] md:h-full
          bg-white dark:bg-dark-surface-primary 
          border-r border-base-surface dark:border-dark-surface-border
          transition-all duration-300 ease-in-out z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isDesktopExpanded ? 'w-64' : 'md:w-16 w-64'}
        `}
      >
        {/* Botão toggle desktop - dentro da sidebar */}
        <div className="hidden md:flex justify-end p-4 border-b border-base-surface dark:border-dark-surface-border">
          <button
            onClick={toggleDesktopSidebar}
            className="p-2 rounded-lg hover:bg-base-surface dark:hover:bg-dark-surface-secondary transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-text-primary dark:text-dark-text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isDesktopExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="flex flex-col h-full pt-4 px-2">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={closeMobileSidebar}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-inter transition-colors
                ${
                  isActive('/')
                    ? 'bg-wine-50 dark:bg-wine-900/20 text-wine-700 dark:text-dark-wine-primary font-medium'
                    : 'text-text-muted dark:text-dark-text-muted hover:bg-base-surface dark:hover:bg-dark-surface-secondary hover:text-wine-700 dark:hover:text-dark-wine-primary'
                }
                ${!isDesktopExpanded ? 'md:justify-center' : ''}
              `}
              title="Adega"
            >
              <WineIcon />
              <span className={`${!isDesktopExpanded ? 'md:hidden' : ''}`}>Adega</span>
            </Link>
            <Link
              to="/settings"
              onClick={closeMobileSidebar}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-inter transition-colors
                ${
                  isActive('/settings')
                    ? 'bg-wine-50 dark:bg-wine-900/20 text-wine-700 dark:text-dark-wine-primary font-medium'
                    : 'text-text-muted dark:text-dark-text-muted hover:bg-base-surface dark:hover:bg-dark-surface-secondary hover:text-wine-700 dark:hover:text-dark-wine-primary'
                }
                ${!isDesktopExpanded ? 'md:justify-center' : ''}
              `}
              title="Configurações"
            >
              <SettingsIcon />
              <span className={`${!isDesktopExpanded ? 'md:hidden' : ''}`}>Configurações</span>
            </Link>
            
            <button
              onClick={() => {
                closeMobileSidebar()
                handleLogout()
              }}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-inter transition-colors w-full
                text-text-muted dark:text-dark-text-muted hover:bg-base-surface dark:hover:bg-dark-surface-secondary hover:text-wine-700 dark:hover:text-dark-wine-primary
                ${!isDesktopExpanded ? 'md:justify-center' : ''}
              `}
              title="Sair"
            >
              <LogoutIcon />
              <span className={`${!isDesktopExpanded ? 'md:hidden' : ''}`}>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
