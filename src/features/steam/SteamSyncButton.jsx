import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { videogameKeys } from '@/features/videogames/queries'
import { syncSteam } from './api'

const ROWS = [
  { key: 'created', label: 'Juegos nuevos', className: 'text-emerald-500' },
  { key: 'updated', label: 'Horas actualizadas', className: 'text-sky-400' },
  { key: 'unchanged', label: 'Sin cambios', className: 'text-muted-foreground' },
  { key: 'skipped', label: 'Omitidos', className: 'text-muted-foreground' },
]

// Step 1: dry run (nothing is saved) and show the summary.
// Step 2: only if the user confirms, run the real sync.
export function SteamSyncButton() {
  const queryClient = useQueryClient()
  const [preview, setPreview] = useState(null)
  const dryRun = useMutation({ mutationFn: () => syncSteam({ dryRun: true }), onSuccess: setPreview })
  const sync = useMutation({
    mutationFn: () => syncSteam({ dryRun: false }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: videogameKeys.all })
      toast.success(`Steam sincronizado: ${result.created} nuevos, ${result.updated} actualizados`)
      setPreview(null)
    },
  })
  const hasChanges = preview && preview.created + preview.updated > 0

  return (
    <>
      <Button variant="outline" onClick={() => dryRun.mutate()} disabled={dryRun.isPending}>
        <RefreshCw className={dryRun.isPending ? 'animate-spin' : undefined} />
        <span className="hidden sm:inline">{dryRun.isPending ? 'Consultando Steam…' : 'Sincronizar Steam'}</span>
        <span className="sm:hidden">Steam</span>
      </Button>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && !sync.isPending && setPreview(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sincronizar con Steam</DialogTitle>
            <DialogDescription>
              Simulación: todavía no se ha guardado nada. Solo se crean juegos nuevos y se actualizan horas; nunca se borra.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <dl className="grid grid-cols-2 gap-2">
              {ROWS.map((row) => (
                <div key={row.key} className="rounded-lg border p-3">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className={`text-2xl font-bold tabular-nums ${row.className}`}>{preview[row.key]}</dd>
                </div>
              ))}
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)} disabled={sync.isPending}>
              {hasChanges ? 'Cancelar' : 'Cerrar'}
            </Button>
            {hasChanges && (
              <Button onClick={() => sync.mutate()} disabled={sync.isPending}>
                {sync.isPending ? 'Sincronizando…' : 'Aplicar cambios'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
