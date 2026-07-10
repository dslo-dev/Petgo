'use client'

import { useState, useEffect } from 'react'
import { MapPinned } from 'lucide-react'
import { useDatosMapa } from '@/hooks/use-map'
import { useGeofence } from '@/hooks/use-geofence'
import { FieldMap } from '@/components/field-map'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ZonaBadge } from '@/components/status-badge'
import { MetricBar } from '@/components/metric-bar'

export function MapaSection() {
  const { mascotas, localizaciones, cargando } = useDatosMapa()
  const [mascotaActiva, setMascotaActiva] = useState<string | null>(null)
  const seleccionada = mascotas.find((m) => m.id === (mascotaActiva ?? mascotas[0]?.id))
  const loc = seleccionada ? localizaciones[seleccionada.id] : null
  const { geovalla, cargando: geoCargando } = useGeofence(seleccionada?.id ?? '')

  const [estadoZona, setEstadoZona] = useState<'dentro' | 'fuera' | 'limite'>('dentro')

  useEffect(() => {
    if (geovalla) {
      setEstadoZona(geovalla.dentroDeZona)
    }
  }, [geovalla])

  if (cargando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (mascotas.length === 0) {
    return (
      <EmptyState
        icon={MapPinned}
        titulo="Sin mascotas"
        descripcion="Agrega una mascota primero para ver su ubicación en el mapa."
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <FieldMap
        radioMetros={geovalla?.radio ?? 150}
        radiusPct={55}
        dentroDeZona={estadoZona}
        mostrarPin
        fotoUrl={seleccionada?.fotoUrl}
        nombre={seleccionada?.nombre}
        className="h-[400px] sm:h-[500px]"
      >
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          {mascotas.map((m) => (
            <button
              key={m.id}
              onClick={() => setMascotaActiva(m.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                (mascotaActiva ?? mascotas[0]?.id) === m.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background/80 text-foreground backdrop-blur-sm hover:bg-accent'
              }`}
            >
              {m.nombre}
            </button>
          ))}
        </div>
      </FieldMap>

      {/* Panel lateral */}
      <div className="space-y-3">
        <Card size="sm">
          <CardContent className="space-y-3">
            <h3 className="text-sm font-medium">
              {seleccionada?.nombre ?? 'Selecciona una mascota'}
            </h3>
            {seleccionada && (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{seleccionada.especie}</span>
                  <span>·</span>
                  <span>{seleccionada.raza}</span>
                </div>

                {geoCargando ? (
                  <Skeleton className="h-5 w-28 rounded-full" />
                ) : (
                  <ZonaBadge dentro={estadoZona} />
                )}

                {loc ? (
                  <p className="text-xs text-muted-foreground">
                    Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)} · Precisión: {loc.precision}m
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin ubicación</p>
                )}

                <MetricBar tipo="bateria" valor={seleccionada.bateria} />
                <MetricBar tipo="senal" valor={seleccionada.senal} />

                {seleccionada.collarId && (
                  <p className="text-xs text-muted-foreground">
                    Collar: {seleccionada.collarId}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
