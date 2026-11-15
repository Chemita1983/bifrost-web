import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { videogameKeys } from '@/features/videogames/queries'
import { CATALOGS } from './config'

const byName = (field) => (a, b) => (a[field] ?? '').localeCompare(b[field] ?? '')

export function useCatalog(type) {
  const { key, api, nameField } = CATALOGS[type]
  return useQuery({
    queryKey: key,
    queryFn: api.list,
    select: (items) => [...items].sort(byName(nameField)),
  })
}

export const usePlatforms = () => useCatalog('platforms')
export const useStores = () => useCatalog('stores')

// Games embed their platform/store, so a change here also refreshes the games.
export function useCatalogMutation(type, action) {
  const queryClient = useQueryClient()
  const { key, api } = CATALOGS[type]
  return useMutation({
    mutationFn: api[action],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      queryClient.invalidateQueries({ queryKey: videogameKeys.all })
    },
  })
}
