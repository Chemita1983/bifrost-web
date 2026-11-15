import { CheckCircle2, Disc3, Download, Trophy, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Small coloured labels that summarise a game's status.
export function GameBadges({ game }) {
  return (
    <div className="flex flex-wrap gap-1">
      {game.isDigital ? (
        <Badge variant="secondary"><Download /> Digital</Badge>
      ) : (
        <Badge variant="secondary"><Disc3 /> Físico</Badge>
      )}
      {game.isCompleted && (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"><CheckCircle2 /> Completado</Badge>
      )}
      {game.isPlatinum && (
        <Badge className="bg-amber-400/15 text-amber-600 dark:text-amber-300"><Trophy /> Platino</Badge>
      )}
      {game.multiplayer && (
        <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-300"><Users /> Multijugador</Badge>
      )}
    </div>
  )
}
