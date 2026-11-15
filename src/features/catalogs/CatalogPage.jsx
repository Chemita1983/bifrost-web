import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { QueryError } from '@/components/QueryState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useVideogames } from '@/features/videogames/queries'
import { CATALOGS } from './config'
import { useCatalog, useCatalogMutation } from './queries'

// Create/edit form. On edit only the changed fields are sent (PATCH).
function CatalogForm({ type, item, onDone }) {
  const config = CATALOGS[type]
  const [values, setValues] = useState(() =>
    Object.fromEntries(config.fields.map((f) => [f.name, item?.[f.name] ?? ''])),
  )
  const [error, setError] = useState(null)
  const create = useCatalogMutation(type, 'create')
  const update = useCatalogMutation(type, 'update')
  const mutation = item ? update : create

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]))
    if (!trimmed[config.nameField]) {
      setError('El nombre es obligatorio.')
      return
    }
    const done = (verb) => () => {
      toast.success(`${trimmed[config.nameField]} ${verb}`)
      onDone()
    }
    if (item) {
      const body = Object.fromEntries(Object.entries(trimmed).filter(([k, v]) => v !== (item[k] ?? '')))
      if (!Object.keys(body).length) return onDone()
      update.mutate({ id: item.id, body }, { onSuccess: done('guardada correctamente') })
    } else {
      const body = Object.fromEntries(Object.entries(trimmed).filter(([, v]) => v !== ''))
      create.mutate(body, { onSuccess: done('creada correctamente') })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{item ? `Editar ${config.singular}` : `Nueva ${config.singular}`}</DialogTitle>
        <DialogDescription>Solo el nombre es obligatorio.</DialogDescription>
      </DialogHeader>
      {config.fields.map((field, index) => (
        <div key={field.name} className="grid gap-1.5">
          <Label htmlFor={field.name}>{field.label}{field.required && ' *'}</Label>
          <Input
            id={field.name}
            value={values[field.name]}
            onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            placeholder={field.placeholder}
            inputMode={field.inputMode}
            autoFocus={index === 0}
            aria-invalid={(field.required && Boolean(error)) || undefined}
          />
        </div>
      ))}
      {(error || mutation.error) && (
        <p role="alert" className="text-sm text-destructive">{error ?? mutation.error.message}</p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={mutation.isPending}>Cancelar</Button>
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Guardando…' : 'Guardar'}</Button>
      </DialogFooter>
    </form>
  )
}

export function CatalogPage({ type }) {
  const config = CATALOGS[type]
  const items = useCatalog(type)
  const games = useVideogames()
  const remove = useCatalogMutation(type, 'remove')
  const [form, setForm] = useState({ open: false, item: null })
  const [toDelete, setToDelete] = useState(null)

  // How many games use each platform/store (helps to understand a 409 on delete).
  const gameCount = useMemo(() => {
    const counts = new Map()
    for (const game of games.data ?? []) {
      const id = type === 'platforms' ? game.platform?.id : game.digitalPlatform?.id
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    return counts
  }, [games.data, type])

  function confirmDelete() {
    remove.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`${toDelete[config.nameField]} borrada`)
        setToDelete(null)
      },
      onError: (error) => {
        if (error.status === 409) setToDelete(null) // the 409 toast already explains why
      },
    })
  }

  const columns = config.fields.slice(1)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.title}</h1>
          <p className="text-sm text-muted-foreground">
            Solo se pueden borrar las que no tienen juegos asociados.
          </p>
        </div>
        <Button onClick={() => setForm({ open: true, item: null })}>
          <Plus /> Nueva {config.singular}
        </Button>
      </div>

      {items.isPending ? (
        <Skeleton className="h-80 rounded-xl" />
      ) : items.isError ? (
        <QueryError error={items.error} onRetry={() => items.refetch()} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                {columns.map((f) => <TableHead key={f.name} className="hidden sm:table-cell">{f.label}</TableHead>)}
                <TableHead className="text-right">Juegos</TableHead>
                <TableHead className="w-24"><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item[config.nameField]}</TableCell>
                  {columns.map((f) => (
                    <TableCell key={f.name} className="hidden text-muted-foreground sm:table-cell">{item[f.name] || '—'}</TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums">{games.data ? gameCount.get(item.id) ?? 0 : '…'}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setForm({ open: true, item })} aria-label={`Editar ${item[config.nameField]}`}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => setToDelete(item)} aria-label={`Borrar ${item[config.nameField]}`}>
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={form.open} onOpenChange={(open) => setForm((f) => ({ ...f, open }))}>
        <DialogContent className="sm:max-w-md">
          <CatalogForm key={form.item?.id ?? 'new'} type={type} item={form.item} onDone={() => setForm((f) => ({ ...f, open: false }))} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`¿Borrar esta ${config.singular}?`}
        description={
          toDelete && gameCount.get(toDelete.id) ? (
            <>
              <strong className="text-foreground">{toDelete[config.nameField]}</strong> tiene {gameCount.get(toDelete.id)} juego(s) asociados,
              así que el servidor rechazará el borrado. Cambia antes esos juegos de {config.singular}.
            </>
          ) : (
            <>Vas a borrar <strong className="text-foreground">{toDelete?.[config.nameField]}</strong>. Esta acción no se puede deshacer.</>
          )
        }
        confirmLabel="Borrar"
        destructive
        isPending={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
