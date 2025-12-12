import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import Input from '../components/Input'
import Button from '../components/Button'
import logoImg from '../../logo.jpg'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const addToast = useToastStore((state) => state.addToast)
  const { user, loading: authLoading } = useAuthStore()

  const from = location.state?.from?.pathname || '/'

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('🔍 Verificando autenticação. User:', user, 'Loading:', authLoading)
    if (!authLoading && user) {
      console.log('✅ Usuário autenticado! Redirecionando para:', from)
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, from])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError('')

    console.log('🔐 Tentando fazer login...')

    try {
      const data = await authService.signIn(email, password)
      console.log('✅ Login bem-sucedido:', data)
      
      if (data.user && data.session) {
        console.log('👤 Usuário:', data.user.email)
        console.log('🔑 Session válida')
        
        addToast('Login realizado com sucesso!', 'success')
        
        // Aguardar um momento para o onAuthStateChange processar
        setTimeout(() => {
          console.log('🚀 Redirecionando para:', from)
          navigate(from, { replace: true })
        }, 100)
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      
      let message = 'Erro ao fazer login. Tente novamente.'
      
      if (error?.message?.toLowerCase()?.includes('invalid login credentials') || 
          error?.message?.toLowerCase()?.includes('user not found') || 
          error?.status === 404) {
        message = 'Dados incorretos. Confira e tente novamente.'
      } else if (error?.message?.toLowerCase()?.includes('email not confirmed')) {
        message = 'E-mail não confirmado. Verifique sua caixa de entrada.'
      }
      
      setFormError(message)
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true)
      
      switch (provider) {
        case 'google':
          await authService.signInWithGoogle()
          break
        case 'facebook':
          await authService.signInWithFacebook()
          break
        case 'microsoft':
          await authService.signInWithMicrosoft()
          break
      }
      
      // O redirect acontece automaticamente
    } catch (error) {
      addToast(error.message || 'Erro ao fazer login social', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-dark-surface-primary shadow-lg rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <img src={logoImg} alt="SmartAdega" className="mx-auto h-20 w-auto" />
            <p className="text-center text-sm text-gray-600 dark:text-dark-text-secondary">
              Entre com sua conta
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <Input
                label="E-mail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
              
              <Input
                label="Senha"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-base font-semibold shadow-md bg-wine-700 text-white hover:bg-wine-600 dark:bg-dark-wine-primary dark:hover:bg-dark-wine-secondary rounded-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2" role="alert" aria-live="assertive">
                {formError}
              </p>
            )}
          </form>

          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-surface-primary text-gray-500 dark:text-dark-text-muted">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div
                onClick={() => handleSocialLogin('google')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSocialLogin('google')
                  }
                }}
                className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-dark-surface-secondary dark:border-dark-surface-border dark:hover:bg-dark-surface-primary flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm text-gray-700 dark:text-dark-text-secondary">Google</span>
              </div>
              
              <div
                onClick={() => handleSocialLogin('facebook')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSocialLogin('facebook')
                  }
                }}
                className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-dark-surface-secondary dark:border-dark-surface-border dark:hover:bg-dark-surface-primary flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm text-gray-700 dark:text-dark-text-secondary">Facebook</span>
              </div>
              
              <div
                onClick={() => handleSocialLogin('microsoft')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSocialLogin('microsoft')
                  }
                }}
                className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-dark-surface-secondary dark:border-dark-surface-border dark:hover:bg-dark-surface-primary flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-sm text-gray-700 dark:text-dark-text-secondary">Microsoft</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-sm text-wine-600 dark:text-dark-wine-primary hover:underline"
            >
              Não tem conta? Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
