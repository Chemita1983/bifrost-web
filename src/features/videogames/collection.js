// Pure helpers to filter, sort and summarise the games in the browser.

export const ALL = 'all'

export const EMPTY_FILTERS = {
  search: '',
  platformId: ALL,
  format: ALL, // 'digital' | 'physical'
  completed: ALL, // 'yes' | 'no'
  multiplayer: ALL, // 'yes' | 'no'
  type: ALL,
}

// "Pokémon" and "pokemon" should match the same search.
const normalize = (text) =>
  (text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

const matchesYesNo = (filter, value) => filter === ALL || (filter === 'yes') === Boolean(value)

export function filterGames(games, filters) {
  const search = normalize(filters.search.trim())
  return games.filter(
    (game) =>
      (!search || normalize(game.videogameName).includes(search)) &&
      (filters.platformId === ALL || String(game.platform?.id) === filters.platformId) &&
      (filters.format === ALL || (filters.format === 'digital') === game.isDigital) &&
      matchesYesNo(filters.completed, game.isCompleted) &&
      matchesYesNo(filters.multiplayer, game.multiplayer) &&
      (filters.type === ALL || game.videogameType === filters.type),
  )
}

export const countActiveFilters = (filters) =>
  Object.entries(filters).filter(([key, value]) => value !== EMPTY_FILTERS[key]).length

export const SORT_OPTIONS = [
  { key: 'name', label: 'Nombre' },
  { key: 'year', label: 'Año' },
  { key: 'platform', label: 'Plataforma' },
  { key: 'type', label: 'Tipo' },
  { key: 'hours', label: 'Horas' },
]

const SORT_VALUE = {
  name: (g) => g.videogameName ?? '',
  year: (g) => Number.parseInt(g.videogameYear, 10) || 0,
  platform: (g) => g.platform?.platformName ?? '',
  type: (g) => g.videogameType ?? '',
  hours: (g) => g.hoursPlayed ?? -1, // unknown hours go last when sorting by most played
}

export function sortGames(games, { key, dir }) {
  const value = SORT_VALUE[key]
  const sign = dir === 'asc' ? 1 : -1
  return [...games].sort((a, b) => {
    const va = value(a)
    const vb = value(b)
    const result = typeof va === 'number' ? va - vb : va.localeCompare(vb)
    // Ties are always broken by name so the order is stable.
    return sign * result || a.videogameName.localeCompare(b.videogameName)
  })
}

export function computeStats(games) {
  return games.reduce(
    (stats, game) => ({
      total: stats.total + 1,
      completed: stats.completed + (game.isCompleted ? 1 : 0),
      platinum: stats.platinum + (game.isPlatinum ? 1 : 0),
      hours: stats.hours + (game.hoursPlayed ?? 0),
    }),
    { total: 0, completed: 0, platinum: 0, hours: 0 },
  )
}

export const distinctTypes = (games) =>
  [...new Set(games.map((g) => g.videogameType).filter(Boolean))].sort((a, b) => a.localeCompare(b))

export const steamCoverUrl = (steamAppId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/header.jpg`

export const formatHours = (hours) =>
  hours === undefined || hours === null ? 'Desconocidas' : `${hours.toLocaleString('es-ES')} h`
