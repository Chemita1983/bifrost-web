import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { steamCoverUrl } from '@/features/videogames/collection'
import { BRAND_ICONS } from './brand-icons'
import { findBrand } from '@/lib/brands'

// Steam cover when the game has a steamAppId. Otherwise (or if the image fails)
// a placeholder in the platform's brand colour with its logo and the game name.
export function CoverImage({ game, className }) {
  const [failed, setFailed] = useState(false)
  const showImage = game.steamAppId && !failed
  const brand = findBrand(game.platform?.platformName)
  const icon = brand && BRAND_ICONS[brand.icon]

  return (
    <div className={cn('relative aspect-[460/215] overflow-hidden bg-muted', className)}>
      {showImage ? (
        <img
          src={steamCoverUrl(game.steamAppId)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
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
