import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  titulo,
  descripcion,
  children,
  className,
}: {
  icon: LucideIcon
  titulo: string
  descripcion?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <p className="font-serif text-lg font-semibold text-foreground text-balance">
        {titulo}
      </p>
      {descripcion && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
          {descripcion}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
