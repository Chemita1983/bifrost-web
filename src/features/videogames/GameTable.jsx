import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Trophy, Users } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const COLUMNS = [
  { key: 'name', label: 'Nombre' },
  { key: 'platform', label: 'Plataforma' },
  { key: 'type', label: 'Tipo', className: 'hidden md:table-cell' },
  { key: 'year', label: 'Año', className: 'hidden sm:table-cell' },
  { key: 'hours', label: 'Horas', className: 'text-right' },
]

function SortableHead({ column, sort, onSortChange }) {
  const active = sort.key === column.key
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <TableHead className={column.className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-foreground"
        onClick={() =>
          onSortChange({ key: column.key, dir: active && sort.dir === 'asc' ? 'desc' : 'asc' })
        }
      >
        {column.label}
        <Icon className={active ? 'size-3.5 text-primary' : 'size-3.5 opacity-40'} aria-hidden="true" />
      </button>
    </TableHead>
  )
}

// Compact table view. Clicking a header sorts; clicking a row opens the detail.
export function GameTable({ games, sort, onSortChange, onSelect }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <SortableHead key={column.key} column={column} sort={sort} onSortChange={onSortChange} />
            ))}
            <TableHead className="hidden lg:table-cell">Formato</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id} className="cursor-pointer" onClick={() => onSelect(game)}>
              <TableCell className="max-w-48 font-medium sm:max-w-72">
                {/* A real button keeps the row reachable with the keyboard. */}
                <button type="button" className="block max-w-full truncate text-left hover:text-primary focus-visible:underline focus-visible:outline-none" onClick={(e) => { e.stopPropagation(); onSelect(game) }} title={game.videogameName}>
                  {game.videogameName}
                </button>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <BrandLogo name={game.platform?.platformName} className="size-6" />
                  {game.platform?.platformName}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{game.videogameType}</TableCell>
              <TableCell className="hidden sm:table-cell tabular-nums">{game.videogameYear}</TableCell>
              <TableCell className="text-right tabular-nums">{game.hoursPlayed ?? '—'}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {game.isDigital ? game.digitalPlatform?.digitalPlatformName ?? 'Digital' : 'Físico'}
              </TableCell>
              <TableCell>
                <div className="flex gap-1.5">
                  {game.isCompleted && <CheckCircle2 className="size-4 text-emerald-500" aria-label="Completado" />}
                  {game.isPlatinum && <Trophy className="size-4 text-amber-400" aria-label="Platino" />}
                  {game.multiplayer && <Users className="size-4 text-sky-400" aria-label="Multijugador" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
