import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId) => {
        set({ userId })
        localStorage.setItem('userId', userId)
      },
      clearUserId: () => {
        set({ userId: null })
        localStorage.removeItem('userId')
      }
    }),
    {
      name: 'user-storage'
    }
  )
)

