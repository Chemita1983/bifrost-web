import { Clock } from 'lucide-react'
import { CoverImage } from '@/components/CoverImage'
import { GameBadges } from './GameBadges'

// Card view: one clickable card per game, opening its detail.
export function GameGrid({ games, onSelect }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <li key={game.id}>
          <button
            type="button"
            onClick={() => onSelect(game)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card text-left transition hover:-translate-y-0.5 hover:border-primary/60 hover:bifrost-glow focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <CoverImage game={game} className="transition group-hover:brightness-110" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div>
                <h3 className="line-clamp-1 font-semibold" title={game.videogameName}>{game.videogameName}</h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {[game.platform?.platformName, game.videogameYear, game.videogameType].filter(Boolean).join(' · ')}
                </p>
              </div>
              <GameBadges game={game} />
              {game.hoursPlayed !== undefined && (
                <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" /> {game.hoursPlayed.toLocaleString('es-ES')} h jugadas
                </p>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
