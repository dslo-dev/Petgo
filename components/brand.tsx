import { cn } from '@/lib/utils'

export function Brand({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('flex items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={compact ? '/Horizontal-logo.png' : '/Horizontal-logo.png'}
        alt="Sanos y Salvos"
        className={compact ? 'h-8 w-auto' : 'h-12 w-auto'}
      />
    </div>
  )
}
