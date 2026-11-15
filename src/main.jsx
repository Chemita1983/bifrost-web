import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { initTheme } from '@/lib/theme'
import App from './App.jsx'
import './index.css'

// Any failed create/edit/delete shows the API message in a toast.
const mutationCache = new MutationCache({
  onError: (error) => {
    if (error.status === 409) {
      toast.error('No se puede borrar: todavía tiene juegos asociados', { description: error.message })
    } else {
      toast.error(error.message)
    }
  },
})

// One QueryClient for the whole app: it caches API responses.
const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false, retry: 1 },
  },
})

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>,
)
