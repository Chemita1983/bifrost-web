import { CheckCircle2, Clock, Gamepad2, Trophy } from 'lucide-react'
import { computeStats } from './collection'

function Stat({ icon: Icon, label, value, hint, iconClass }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${iconClass}`}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

const percent = (part, total) => (total ? `${Math.round((part / total) * 100)}% del total` : '—')

// Counters for the games currently shown (they follow the active filters).
export function StatsBar({ games, totalInCollection }) {
  const stats = computeStats(games)
  const filtered = stats.total !== totalInCollection
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat
        icon={Gamepad2}
        label="Juegos"
        value={stats.total}
        hint={filtered ? `de ${totalInCollection} en la colección` : 'en la colección'}
        iconClass="bg-violet-500/15 text-violet-600 dark:text-violet-300"
      />
      <Stat
        icon={CheckCircle2}
        label="Completados"
        value={stats.completed}
        hint={percent(stats.completed, stats.total)}
        iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      />
      <Stat
        icon={Trophy}
        label="Platinos"
        value={stats.platinum}
        hint={percent(stats.platinum, stats.total)}
        iconClass="bg-amber-400/15 text-amber-600 dark:text-amber-300"
      />
      <Stat
        icon={Clock}
        label="Horas jugadas"
        value={stats.hours.toLocaleString('es-ES')}
        hint="solo juegos con horas conocidas"
        iconClass="bg-sky-500/15 text-sky-600 dark:text-sky-300"
      />
    </div>
  )
}
