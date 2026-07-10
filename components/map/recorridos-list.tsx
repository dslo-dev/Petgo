'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Route } from 'lucide-react'
import { useRecorridos, useDatosMapa } from '@/hooks/use-map'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const LeafletMapRecorrido = dynamic(
  () => import('./leaflet-map-recorrido').then((m) => m.LeafletMapRecorrido),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg sm:h-[500px]" />,
  },
)

export function RecorridosList() {
  const { mascotas, cargando: mascCargando } = useDatosMapa()
  const [mascotaFiltro, setMascotaFiltro] = useState<string | undefined>(undefined)
  const { recorridos, cargando } = useRecorridos(mascotaFiltro)
  const activo = recorridos[0] ?? null

  if (mascCargando || cargando) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (mascotas.length === 0) {
    return (
      <EmptyState
        icon={Route}
        titulo="Recorridos"
        descripcion="Agrega una mascota para ver su historial de recorridos."
      />
    )
  }

  if (recorridos.length === 0) {
    return (
      <EmptyState
        icon={Route}
        titulo="Sin recorridos"
        descripcion="Aún no hay recorridos registrados para esta mascota."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={mascotaFiltro ?? ''}
          onValueChange={(val) => setMascotaFiltro(val || undefined)}
        >
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="Todas las mascotas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las mascotas</SelectItem>
            {mascotas.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {recorridos.length > 1 && (
          <span className="text-xs text-muted-foreground">
            {recorridos.length} recorridos · mostrando el más reciente
          </span>
        )}
      </div>

      {activo && <LeafletMapRecorrido recorrido={activo} />}
    </div>
  )
}
