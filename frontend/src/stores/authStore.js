import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      
      setSession: (session) => set({ session }),
      
      setAuth: (user, session) => set({ user, session, loading: false }),
      
      clearAuth: () => set({ user: null, session: null, loading: false }),
      
      setLoading: (loading) => set({ loading }),

      // Helper para pegar token
      getAccessToken: () => {
        const { session } = get()
        return session?.access_token || null
      },

      // Helper para pegar userId
      getUserId: () => {
        const { user } = get()
        return user?.id || null
      }
    }),
    {
      name: 'auth-storage',
      // Não persistir session completa por segurança
      partialize: (state) => ({ 
        user: state.user 
      })
    }
  )
)
