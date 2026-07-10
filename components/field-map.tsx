import { cn } from '@/lib/utils'

type EstadoZona = 'dentro' | 'fuera' | 'limite'

const estadoEstilos: Record<EstadoZona, { borde: string; fondo: string; texto: string; pinClase: string }> = {
  dentro: {
    borde: 'border-safe/60',
    fondo: 'bg-safe/10',
    texto: 'text-safe',
    pinClase: 'border-safe',
  },
  fuera: {
    borde: 'border-urgent/60',
    fondo: 'bg-urgent/10',
    texto: 'text-urgent',
    pinClase: 'border-urgent',
  },
  limite: {
    borde: 'border-caution/60',
    fondo: 'bg-caution/10',
    texto: 'text-caution-foreground',
    pinClase: 'border-caution',
  },
}

interface FieldMapProps {
  radioMetros?: number
  radiusPct?: number
  dentroDeZona?: EstadoZona
  mostrarPin?: boolean
  fotoUrl?: string
  nombre?: string
  className?: string
  children?: React.ReactNode
}

// Mapa estilizado tipo carta topográfica. Es un PLACEHOLDER visual: cuando haya
// una API key de mapas (Mapbox / Google Maps), reemplazar el contenido interno
// por el mapa real manteniendo el overlay de geovalla y el pin de señal.
export function FieldMap({
  radioMetros,
  radiusPct = 55,
  dentroDeZona = 'dentro',
  mostrarPin = true,
  fotoUrl,
  nombre,
  className,
  children,
}: FieldMapProps) {
  const estilo = estadoEstilos[dentroDeZona]
  const moverPin = dentroDeZona === 'fuera'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border topo-grid',
        className,
      )}
      role="img"
      aria-label={`Mapa de ubicación${nombre ? ` de ${nombre}` : ''}`}
    >
      <div className="absolute inset-0 topo-contours opacity-70" />

      <span className="absolute left-3 top-3 rounded border border-border/60 bg-card/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        Vista de mapa · placeholder
      </span>

      {/* Zona segura (geovalla) */}
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2',
          estilo.borde,
          estilo.fondo,
        )}
        style={{
          width: `${radiusPct}%`,
          aspectRatio: '1 / 1',
        }}
      >
        {radioMetros != null && (
          <span
            className={cn(
              'absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-card px-1.5 py-0.5 font-mono text-[10px]',
              estilo.texto,
            )}
          >
            r = {radioMetros} m
          </span>
        )}
      </div>

      {/* Pin de la mascota con anillo de señal pulsante */}
      {mostrarPin && (
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            moverPin && 'left-[68%] top-[38%]',
          )}
        >
          <span className="absolute inset-0 -z-0 flex items-center justify-center">
            <span
              className={cn(
                'absolute size-12 rounded-full animate-signal',
                dentroDeZona === 'dentro' ? 'bg-safe/40' : dentroDeZona === 'limite' ? 'bg-caution/40' : 'bg-urgent/40',
              )}
            />
          </span>
          <span
            className={cn(
              'relative flex size-11 items-center justify-center overflow-hidden rounded-full border-2 bg-card shadow-lg',
              estilo.pinClase,
            )}
          >
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoUrl || '/placeholder.svg'}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span
                className={cn(
                  'size-3 rounded-full',
                  estilo.fondo,
                )}
              />
            )}
          </span>
        </div>
      )}

      {children}
    </div>
  )
}
