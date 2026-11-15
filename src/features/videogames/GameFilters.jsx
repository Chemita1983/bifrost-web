import { ArrowDownAZ, ArrowUpZA, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL, EMPTY_FILTERS, SORT_OPTIONS, countActiveFilters } from './collection'

function FilterSelect({ label, value, onChange, options, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={className ?? 'w-full sm:w-44'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const yesNo = (allLabel, yes, no) => [
  { value: ALL, label: allLabel },
  { value: 'yes', label: yes },
  { value: 'no', label: no },
]

// Search box, filters and sort controls. It only edits state owned by the page.
export function GameFilters({ filters, onFiltersChange, sort, onSortChange, platforms, types }) {
  const set = (key) => (value) => onFiltersChange({ ...filters, [key]: value })
  const active = countActiveFilters(filters)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={filters.search}
          onChange={(event) => set('search')(event.target.value)}
          placeholder="Buscar por nombre…"
          aria-label="Buscar por nombre"
          className="h-10 pl-9 text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <FilterSelect
          label="Plataforma"
          value={filters.platformId}
          onChange={set('platformId')}
          options={[
            { value: ALL, label: 'Plataforma: todas' },
            ...platforms.map((p) => ({ value: String(p.id), label: p.platformName })),
          ]}
          className="w-full sm:w-48"
        />
        <FilterSelect
          label="Formato"
          value={filters.format}
          onChange={set('format')}
          options={[
            { value: ALL, label: 'Formato: todos' },
            { value: 'digital', label: 'Digital' },
            { value: 'physical', label: 'Físico' },
          ]}
        />
        <FilterSelect
          label="Completado"
          value={filters.completed}
          onChange={set('completed')}
          options={yesNo('Completado: todos', 'Completados', 'Sin completar')}
        />
        <FilterSelect
          label="Multijugador"
          value={filters.multiplayer}
          onChange={set('multiplayer')}
          options={yesNo('Multijugador: todos', 'Multijugador', 'Un jugador')}
        />
        <FilterSelect
          label="Tipo"
          value={filters.type}
          onChange={set('type')}
          options={[{ value: ALL, label: 'Tipo: todos' }, ...types.map((t) => ({ value: t, label: t }))]}
        />

        <div className="col-span-2 flex items-center gap-2 sm:ml-auto">
          <FilterSelect
            label="Ordenar por"
            value={sort.key}
            onChange={(key) => onSortChange({ ...sort, key })}
            options={SORT_OPTIONS.map((o) => ({ value: o.key, label: `Ordenar: ${o.label}` }))}
            className="flex-1 sm:w-44"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortChange({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' })}
            aria-label={sort.dir === 'asc' ? 'Orden ascendente (cambiar a descendente)' : 'Orden descendente (cambiar a ascendente)'}
            title={sort.dir === 'asc' ? 'Ascendente' : 'Descendente'}
          >
            {sort.dir === 'asc' ? <ArrowDownAZ /> : <ArrowUpZA />}
          </Button>
          {active > 0 && (
            <Button variant="ghost" onClick={() => onFiltersChange(EMPTY_FILTERS)}>
              <X /> Limpiar ({active})
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
