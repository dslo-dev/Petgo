import { Battery, Signal, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function tono(valor: number) {
  if (valor >= 60) return 'bg-safe'
  if (valor >= 25) return 'bg-caution'
  return 'bg-urgent'
}

export function MetricBar({
  tipo,
  valor,
  className,
}: {
  tipo: 'bateria' | 'senal'
  valor: number
  className?: string
}) {
  const Icon: LucideIcon = tipo === 'bateria' ? Battery : Signal
  const label = tipo === 'bateria' ? 'Batería' : 'Señal'
  return (
    <div className={cn('flex items-center gap-2 rounded-lg bg-muted/60 p-2.5', className)}>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="font-mono text-xs font-medium text-foreground">
            {valor}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn('h-full rounded-full transition-all', tono(valor))}
            style={{ width: `${valor}%` }}
          />
        </div>
      </div>
    </div>
  )
}
