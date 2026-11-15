import { Pencil, Trash2 } from 'lucide-react'
import { CoverImage } from '@/components/CoverImage'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatHours } from './collection'
import { GameBadges } from './GameBadges'

function Field({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b py-2 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children ?? '—'}</dd>
    </div>
  )
}

const yesNo = (value) => (value ? 'Sí' : 'No')

// Side panel with every field of the game (there is no GET /videogame/{id}:
// the data comes from the list already loaded).
export function GameDetailSheet({ game, onOpenChange, onEdit, onDelete }) {
  return (
    <Sheet open={Boolean(game)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {game && (
          <>
            <CoverImage game={game} />
            <SheetHeader>
              <SheetTitle className="text-xl">{game.videogameName}</SheetTitle>
              <SheetDescription>
                {[game.companyName, game.videogameYear].filter(Boolean).join(' · ') || 'Sin compañía ni año'}
              </SheetDescription>
              <GameBadges game={game} />
            </SheetHeader>
            <dl className="px-4 text-sm">
              <Field label="Plataforma">{game.platform?.platformName}</Field>
              <Field label="Formato">{game.isDigital ? 'Digital' : 'Físico'}</Field>
              {game.isDigital && <Field label="Tienda">{game.digitalPlatform?.digitalPlatformName}</Field>}
              <Field label="Tipo">{game.videogameType}</Field>
              <Field label="Año">{game.videogameYear}</Field>
              <Field label="Compañía">{game.companyName}</Field>
              <Field label="Horas jugadas">{formatHours(game.hoursPlayed)}</Field>
              <Field label="Completado">{yesNo(game.isCompleted)}</Field>
              <Field label="Platino">{yesNo(game.isPlatinum)}</Field>
              <Field label="Multijugador">{yesNo(game.multiplayer)}</Field>
              {game.steamAppId && (
                <Field label="Steam">
                  <a
                    href={`https://store.steampowered.com/app/${game.steamAppId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    App {game.steamAppId}
                  </a>
                </Field>
              )}
            </dl>
            <SheetFooter className="flex-row">
              <Button className="flex-1" onClick={() => onEdit(game)}>
                <Pencil /> Editar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => onDelete(game)}>
                <Trash2 /> Borrar
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
