import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToastStore } from '../stores/toastStore'
import Spinner from '../components/Spinner'

const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    // O Supabase processa o callback automaticamente
    // Após processar, redirecionamos para home
    const timer = setTimeout(() => {
      addToast('Login realizado com sucesso!', 'success')
      navigate('/', { replace: true })
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate, addToast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600 dark:text-dark-text-secondary">
          Processando login...
        </p>
      </div>
    </div>
  )
}

export default AuthCallbackPage
