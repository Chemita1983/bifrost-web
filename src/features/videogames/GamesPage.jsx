import { useMemo, useState } from 'react'
import { LayoutGrid, Plus, Rows3, SearchX } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState, QueryError } from '@/components/QueryState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlatforms } from '@/features/catalogs/queries'
import { EMPTY_FILTERS, distinctTypes, filterGames, sortGames } from './collection'
import { GameDetailSheet } from './GameDetailSheet'
import { GameFilters } from './GameFilters'
import { GameFormDialog } from './GameFormDialog'
import { GameGrid } from './GameGrid'
import { GameTable } from './GameTable'
import { StatsBar } from './StatsBar'
import { useDeleteVideogame, useVideogames } from './queries'

const VIEW_KEY = 'bifrost-web:view'
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'grid'
  } catch {
    return 'grid'
  }
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Cargando juegos">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border bg-card">
          <Skeleton className="aspect-[460/215] rounded-none" />
          <div className="grid gap-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function GamesPage() {
  const games = useVideogames()
  const platforms = usePlatforms()
  const deleteGame = useDeleteVideogame()

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [view, setView] = useState(readView)
  // Only ids are stored: the game itself is always read from the fresh query data.
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState({ open: false, gameId: null })
  const [toDelete, setToDelete] = useState(null)

  const all = useMemo(() => games.data ?? [], [games.data])
  const types = useMemo(() => distinctTypes(all), [all])
  const visible = useMemo(() => sortGames(filterGames(all, filters), sort), [all, filters, sort])
  const selected = all.find((g) => g.id === selectedId) ?? null
  const editing = all.find((g) => g.id === form.gameId) ?? null

  function changeView(next) {
    setView(next)
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice just won't be remembered.
    }
  }

  function confirmDelete() {
    deleteGame.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`«${toDelete.videogameName}» borrado`)
        if (selectedId === toDelete.id) setSelectedId(null)
        setToDelete(null)
      },
    })
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mi colección</h1>
          <p className="text-sm text-muted-foreground">Todos tus juegos, de todas tus plataformas.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-0.5" role="group" aria-label="Vista">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => changeView('grid')} aria-pressed={view === 'grid'} aria-label="Vista de tarjetas" title="Tarjetas">
              <LayoutGrid />
            </Button>
            <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => changeView('table')} aria-pressed={view === 'table'} aria-label="Vista de tabla" title="Tabla">
              <Rows3 />
            </Button>
          </div>
          <Button onClick={() => setForm({ open: true, gameId: null })}>
            <Plus /> Nuevo juego
          </Button>
        </div>
      </div>

      {games.isPending ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[88px] rounded-xl" />)}
          </div>
          <LoadingGrid />
        </>
      ) : games.isError ? (
        <QueryError error={games.error} onRetry={() => games.refetch()} />
      ) : (
        <>
          <StatsBar games={visible} totalInCollection={all.length} />
          <GameFilters
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            platforms={platforms.data ?? []}
            types={types}
          />
          {visible.length === 0 ? (
            <EmptyState icon={SearchX} title={all.length ? 'Ningún juego coincide con los filtros' : 'Tu colección está vacía'}>
              {all.length > 0 && (
                <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>Limpiar filtros</Button>
              )}
            </EmptyState>
          ) : view === 'grid' ? (
            <GameGrid games={visible} onSelect={(g) => setSelectedId(g.id)} />
          ) : (
            <GameTable games={visible} sort={sort} onSortChange={setSort} onSelect={(g) => setSelectedId(g.id)} />
          )}
        </>
      )}

      <GameDetailSheet
        game={selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onEdit={(g) => setForm({ open: true, gameId: g.id })}
        onDelete={setToDelete}
      />
      <GameFormDialog
        open={form.open}
        onOpenChange={(open) => setForm((f) => ({ ...f, open }))}
        game={editing}
        types={types}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Borrar este juego?"
        description={
          <>Vas a borrar <strong className="text-foreground">«{toDelete?.videogameName}»</strong> de tu colección. Esta acción no se puede deshacer.</>
        }
        confirmLabel="Borrar"
        destructive
        isPending={deleteGame.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
