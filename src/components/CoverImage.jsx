import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findBrand, gameBrandName } from '@/lib/brands'
import { steamCoverUrl } from '@/features/videogames/collection'
import { BRAND_ICONS } from './brand-icons'

// Image sources in order of preference: the game's own coverUrl, then Steam.
const coverSources = (game) =>
  [game.coverUrl, game.steamAppId && steamCoverUrl(game.steamAppId)].filter(Boolean)

// Shows the first image that loads; if every source fails (or there is none),
// a placeholder in the platform's brand colour with its logo and the game name.
// The parent should pass key={coverUrl} if the sources can change while mounted.
export function CoverImage({ game, className }) {
  const sources = coverSources(game)
  const [failedCount, setFailedCount] = useState(0)
  const src = sources[failedCount]
  const brand = findBrand(gameBrandName(game))
  const icon = brand && BRAND_ICONS[brand.icon]

  return (
    <div className={cn('relative aspect-[460/215] overflow-hidden bg-muted', className)}>
      {src ? (
        <>
          {/* Blurred copy behind, so portrait box art is shown whole without empty bars. */}
          <img src={src} alt="" aria-hidden="true" referrerPolicy="no-referrer" className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-xl" />
          <img
            src={src}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailedCount((n) => n + 1)}
            className="relative size-full object-contain"
          />
        </>
      ) : (
        <div
          className="relative flex size-full flex-col items-center justify-center gap-2 p-3 text-center text-white"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 15%, ${brand?.color ?? '#7c3aed'} 0%, transparent 70%), linear-gradient(135deg, ${brand?.color ?? '#7c3aed'}, #0b0a1a)`,
          }}
        >
          {/* Big faded logo in the background for a bit of texture. */}
          {icon && (
            <svg viewBox={icon.viewBox} fill="currentColor" className="absolute -right-4 -bottom-6 size-36 rotate-[-12deg] opacity-15" aria-hidden="true">
              <path d={icon.path} />
            </svg>
          )}
          {icon ? (
            <svg viewBox={icon.viewBox} fill="currentColor" className="relative size-9 drop-shadow" aria-hidden="true">
              <path d={icon.path} />
            </svg>
          ) : (
            <Gamepad2 className="relative size-8 opacity-80" aria-hidden="true" />
          )}
          <span className="relative line-clamp-2 text-sm font-semibold drop-shadow">{game.videogameName}</span>
        </div>
      )}
    </div>
  )
}
