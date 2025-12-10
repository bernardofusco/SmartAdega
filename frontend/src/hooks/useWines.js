import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wineService } from '../services/wineService'

export const useWines = () => {
  return useQuery({
    queryKey: ['wines'],
    queryFn: wineService.getAll,
    staleTime: 1000 * 60 * 5
  })
}

export const useWine = (id) => {
  return useQuery({
    queryKey: ['wine', id],
    queryFn: () => wineService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateWine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: wineService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
    }
  })
}

export const useUpdateWine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => wineService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
      queryClient.invalidateQueries({ queryKey: ['wine', variables.id] })
    }
  })
}

export const useDeleteWine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: wineService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines'] })
    }
  })
}

