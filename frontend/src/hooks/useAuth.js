import { useEffect, useRef } from 'react'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/authService'

export const useAuth = () => {
  const { user, session, loading, setAuth, clearAuth, setLoading } = useAuthStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Carregar sessão inicial
    const loadSession = async () => {
      try {
        console.log('🔄 Carregando sessão inicial...')
        setLoading(true)
        const session = await authService.getSession()
        console.log('📦 Sessão carregada:', session)
        
        if (session) {
          const user = await authService.getCurrentUser()
          console.log('👤 Usuário atual:', user)
          setAuth(user, session)
        } else {
          console.log('⚠️ Nenhuma sessão encontrada')
          clearAuth()
        }
      } catch (error) {
        console.error('❌ Erro ao carregar sessão:', error)
        // Se houver erro de signature, limpar tudo
        if (error.message?.includes('invalid') || error.message?.includes('signature')) {
          console.log('🧹 Token inválido detectado. Limpando sessão...')
          await authService.signOut().catch(() => {})
        }
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    loadSession()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state changed:', event, 'Session:', !!session)
        
        // Só processar eventos importantes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('✅ Sessão ativa, atualizando user:', session.user.email)
            setAuth(session.user, session)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('⚠️ Logout detectado')
          clearAuth()
        }
        // Ignorar outros eventos (USER_UPDATED, INITIAL_SESSION, etc)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user
  }
}
