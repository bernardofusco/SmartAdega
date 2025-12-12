import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wineService } from '../services/wineService'
import { useAuthStore } from '../stores/authStore'

export const useWines = () => {
  const userId = useAuthStore((state) => state.user?.id)
  
  return useQuery({
    queryKey: ['wines', userId],
    queryFn: wineService.getAll,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  })
}

export const useWine = (id) => {
  const userId = useAuthStore((state) => state.user?.id)
  
  return useQuery({
    queryKey: ['wine', userId, id],
    queryFn: () => wineService.getById(id),
    enabled: !!id && !!userId,
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateWine = () => {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: wineService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines', userId] })
    }
  })
}

export const useUpdateWine = () => {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: ({ id, data }) => wineService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wines', userId] })
      queryClient.invalidateQueries({ queryKey: ['wine', userId, variables.id] })
    }
  })
}

export const useDeleteWine = () => {
  const queryClient = useQueryClient()
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: wineService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines', userId] })
    }
  })
}

