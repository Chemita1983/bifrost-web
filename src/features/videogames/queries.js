import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createVideogame, deleteVideogame, fetchVideogames, updateVideogame } from './api'

// Every cached piece of videogame data lives under this key.
export const videogameKeys = {
  all: ['videogames'],
  list: () => [...videogameKeys.all, 'list'],
}

// The API has no pagination: load the whole collection once and filter in the browser.
export function useVideogames() {
  return useQuery({ queryKey: videogameKeys.list(), queryFn: fetchVideogames })
}

function useVideogameMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: videogameKeys.all }),
  })
}

export const useCreateVideogame = () => useVideogameMutation(createVideogame)
export const useUpdateVideogame = () => useVideogameMutation(updateVideogame)
export const useDeleteVideogame = () => useVideogameMutation(deleteVideogame)
