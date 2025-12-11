import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-base-surface h-16 flex justify-around items-center z-50">
      <Link 
        to="/" 
        className={`font-inter transition-colors ${
          isActive('/') ? 'text-wine-700' : 'text-text-muted hover:text-wine-700'
        }`}
      >
        Adega
      </Link>
      <Link 
        to="/settings" 
        className={`font-inter transition-colors ${
          isActive('/settings') ? 'text-wine-700' : 'text-text-muted hover:text-wine-700'
        }`}
      >
        Configurações
      </Link>
    </nav>
  )
}
