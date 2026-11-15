import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Shown when a query fails (for example, the backend is stopped).
export function QueryError({ error, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
      <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
      <p className="font-medium">No se han podido cargar los datos</p>
      <p className="text-sm text-muted-foreground">{error?.message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCw /> Reintentar
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
      {Icon && <Icon className="size-8 text-muted-foreground" aria-hidden="true" />}
      <p className="font-medium">{title}</p>
      {children}
    </div>
  )
}
