import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { usePlatforms, useStores } from '@/features/catalogs/queries'
import { CoverImage } from '@/components/CoverImage'
import { isHttpUrl, toCreateBody, toFormValues, toPatchBody, validate } from './gameForm'
import { useCreateVideogame, useUpdateVideogame } from './queries'

function FormField({ id, label, error, hint, children }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

function SwitchField({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

// The form lives in its own component so its state starts fresh every time
// the dialog opens (the dialog unmounts its content when closed).
function GameForm({ game, types, onDone }) {
  const isEdit = Boolean(game)
  const [values, setValues] = useState(() => toFormValues(game))
  const [errors, setErrors] = useState({})
  const platforms = usePlatforms()
  const stores = useStores()
  const create = useCreateVideogame()
  const update = useUpdateVideogame()
  const mutation = isEdit ? update : create

  const set = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }))
    // Editing a field clears its error; the rest are checked again on submit.
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }
  const inputProps = (name) => ({
    id: name,
    value: values[name],
    onChange: (event) => set(name)(event.target.value),
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    if (isEdit) {
      const body = toPatchBody(values, game)
      if (!Object.keys(body).length) {
        toast.info('No hay cambios que guardar')
        onDone()
        return
      }
      update.mutate(
        { id: game.id, body },
        { onSuccess: () => { toast.success(`«${values.videogameName.trim()}» guardado correctamente`); onDone() } },
      )
    } else {
      create.mutate(toCreateBody(values), {
        onSuccess: () => { toast.success(`«${values.videogameName.trim()}» añadido a la colección`); onDone() },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Editar juego' : 'Nuevo juego'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Solo se enviarán los campos que cambies.' : 'Los campos con * son obligatorios.'}
        </DialogDescription>
      </DialogHeader>

      <FormField id="videogameName" label="Nombre *" error={errors.videogameName}>
        <Input {...inputProps('videogameName')} autoFocus placeholder="Hollow Knight" />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="videogameType" label="Tipo" error={errors.videogameType}>
          <Input {...inputProps('videogameType')} list="videogame-types" placeholder="Action RPG" />
          {/* A datalist suggests the types already used in the collection. */}
          <datalist id="videogame-types">
            {types.map((type) => <option key={type} value={type} />)}
          </datalist>
        </FormField>
        <FormField id="videogameYear" label="Año" error={errors.videogameYear}>
          <Input {...inputProps('videogameYear')} inputMode="numeric" maxLength={4} placeholder="2017" />
        </FormField>
        <FormField id="companyName" label="Compañía" error={errors.companyName}>
          <Input {...inputProps('companyName')} placeholder="Team Cherry" />
        </FormField>
        <FormField id="hoursPlayed" label="Horas jugadas" error={errors.hoursPlayed} hint="Vacío = desconocidas (no es lo mismo que 0).">
          <Input {...inputProps('hoursPlayed')} inputMode="numeric" placeholder="Desconocidas" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="platformId" label="Plataforma *" error={errors.platformId}>
          <Select value={values.platformId} onValueChange={set('platformId')} disabled={platforms.isPending}>
            <SelectTrigger id="platformId" className="w-full" aria-invalid={Boolean(errors.platformId) || undefined}>
              <SelectValue placeholder={platforms.isPending ? 'Cargando…' : 'Elige plataforma'} />
            </SelectTrigger>
            <SelectContent>
              {platforms.data?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.platformName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          id="digitalPlatformId"
          label={values.isDigital ? 'Tienda digital *' : 'Tienda digital'}
          error={errors.digitalPlatformId}
          hint={values.isDigital ? undefined : 'Solo para juegos digitales.'}
        >
          <Select value={values.digitalPlatformId} onValueChange={set('digitalPlatformId')} disabled={!values.isDigital || stores.isPending}>
            <SelectTrigger id="digitalPlatformId" className="w-full" aria-invalid={Boolean(errors.digitalPlatformId) || undefined}>
              <SelectValue placeholder={values.isDigital ? 'Elige tienda' : 'Juego físico'} />
            </SelectTrigger>
            <SelectContent>
              {stores.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.digitalPlatformName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_11rem] sm:items-start">
        <FormField
          id="coverUrl"
          label="URL de la carátula"
          error={errors.coverUrl}
          hint={game?.steamAppId ? 'Opcional. Si la dejas vacía se usa la de Steam.' : 'Opcional. Pega la dirección de una imagen (http o https).'}
        >
          <Input {...inputProps('coverUrl')} type="url" inputMode="url" placeholder="https://…/caratula.jpg" />
        </FormField>
        {/* Live preview: the same component the cards use, with the URL being typed. */}
        <div className="grid gap-1.5">
          <span className="text-sm font-medium">Vista previa</span>
          <CoverImage
            key={values.coverUrl.trim()}
            className="rounded-lg border"
            game={{
              ...game,
              videogameName: values.videogameName || 'Nuevo juego',
              platform: platforms.data?.find((p) => String(p.id) === values.platformId),
              isDigital: values.isDigital,
              digitalPlatform: stores.data?.find((s) => String(s.id) === values.digitalPlatformId),
              coverUrl: isHttpUrl(values.coverUrl.trim()) ? values.coverUrl.trim() : undefined,
            }}
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <SwitchField id="isDigital" label="Digital" checked={values.isDigital} onChange={set('isDigital')} />
        <SwitchField id="multiplayer" label="Multijugador" checked={values.multiplayer} onChange={set('multiplayer')} />
        <SwitchField id="isCompleted" label="Completado" checked={values.isCompleted} onChange={set('isCompleted')} />
        <SwitchField id="isPlatinum" label="Platino" checked={values.isPlatinum} onChange={set('isPlatinum')} />
      </div>

      {mutation.error && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {mutation.error.message}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={mutation.isPending}>Cancelar</Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear juego'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// game = null → create mode; game = object → edit mode.
export function GameFormDialog({ open, onOpenChange, game, types }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <GameForm key={game?.id ?? 'new'} game={game} types={types} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
