import { cn } from '@/lib/utils'

const estadoConfig = {
  dentro: {
    label: 'Dentro de zona',
    clase: 'bg-safe/15 text-safe border-safe/30',
    punto: 'bg-safe',
  },
  fuera: {
    label: 'Fuera de zona',
    clase: 'bg-urgent/15 text-urgent border-urgent/30',
    punto: 'bg-urgent',
  },
  limite: {
    label: 'A punto de salir',
    clase: 'bg-caution/15 text-caution-foreground border-caution/30',
    punto: 'bg-caution',
  },
} as const

export function ZonaBadge({
  dentro,
  className,
}: {
  dentro: keyof typeof estadoConfig
  className?: string
}) {
  const cfg = estadoConfig[dentro]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium',
        cfg.clase,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.punto)} />
      {cfg.label}
    </span>
  )
}
