import { Monitor, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { findBrand } from '@/lib/brands'
import { BRAND_ICONS } from './brand-icons'

// Small square tile with the brand colour and its white logo.
// Falls back to a generic icon when the name is not recognised.
export function BrandLogo({ name, kind = 'platform', className }) {
  const brand = findBrand(name)
  const icon = brand && BRAND_ICONS[brand.icon]
  const Fallback = kind === 'store' ? Store : Monitor
  return (
    <span
      className={cn(
        'inline-grid size-7 shrink-0 place-items-center rounded-md text-white ring-1 ring-white/10',
        !icon && 'bg-muted text-muted-foreground',
        className,
      )}
      style={icon ? { backgroundColor: brand.color } : undefined}
      aria-hidden="true"
    >
      {icon ? (
        <svg viewBox={icon.viewBox} fill="currentColor" className="size-[62%]">
          <path d={icon.path} />
        </svg>
      ) : (
        <Fallback className="size-[60%]" />
      )}
    </span>
  )
}
