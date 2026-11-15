import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { steamCoverUrl } from '@/features/videogames/collection'

// Full class names (not built by concatenation) so Tailwind can detect them.
const FALLBACK_GRADIENTS = [
  'from-fuchsia-600/70 via-violet-700/60 to-indigo-900/80',
  'from-cyan-500/70 via-sky-700/60 to-indigo-900/80',
  'from-emerald-500/70 via-teal-700/60 to-slate-900/80',
  'from-amber-500/70 via-orange-700/60 to-rose-900/80',
  'from-rose-500/70 via-pink-700/60 to-purple-900/80',
]

const pickGradient = (name) =>
  FALLBACK_GRADIENTS[[...(name ?? '')].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % FALLBACK_GRADIENTS.length]

// Steam cover when the game has a steamAppId; a colourful placeholder otherwise
// (or when the image fails to load).
export function CoverImage({ game, className }) {
  const [failed, setFailed] = useState(false)
  const showImage = game.steamAppId && !failed

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
          className={cn(
            'flex size-full flex-col items-center justify-center gap-1 bg-gradient-to-br p-3 text-center text-white',
            pickGradient(game.videogameName),
          )}
        >
          <Gamepad2 className="size-7 opacity-80" aria-hidden="true" />
          <span className="line-clamp-2 text-sm font-semibold drop-shadow">{game.videogameName}</span>
        </div>
      )}
    </div>
  )
}
