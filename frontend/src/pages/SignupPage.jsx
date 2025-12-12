import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import Input from '../components/Input'
import Button from '../components/Button'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const { user } = useAuthStore()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addToast('As senhas não coincidem', 'error')
      return
    }

    if (password.length < 6) {
      addToast('A senha deve ter no mínimo 6 caracteres', 'error')
      return
    }

    setLoading(true)

    try {
      await authService.signUp(email, password)
      addToast('Conta criada! Verifique seu e-mail para confirmar.', 'success')
      navigate('/login')
    } catch (error) {
      addToast(error.message || 'Erro ao criar conta', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-dark-text-primary">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
            Cadastre-se no SmartAdega
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">
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

            <Input
              label="Confirmar Senha"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-wine-600 dark:text-dark-wine-primary hover:underline"
          >
            Já tem conta? Faça login
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
