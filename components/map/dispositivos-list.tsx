'use client'

import { useState } from 'react'
import { Cctv, Battery, Signal, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDispositivos, useDatosMapa } from '@/hooks/use-map'
import { mapaApi } from '@/lib/api'
import { type DispositivoGPS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const estadoLabel: Record<DispositivoGPS['estado'], string> = {
  conectado: 'Conectado',
  desconectado: 'Desconectado',
  bajo_bateria: 'Batería baja',
}

const estadoColor: Record<DispositivoGPS['estado'], string> = {
  conectado: 'text-safe',
  desconectado: 'text-muted-foreground',
  bajo_bateria: 'text-caution',
}

function tonoBateria(valor: number) {
  if (valor >= 60) return 'bg-safe'
  if (valor >= 25) return 'bg-caution'
  return 'bg-urgent'
}

export function DispositivosList() {
  const { dispositivos, cargando, recargar } = useDispositivos()
  const { mascotas } = useDatosMapa()
  const [asignando, setAsignando] = useState<string | null>(null)

  async function handleAsignar(dispositivoId: string, mascotaId: string) {
    const mascota = mascotas.find((m) => m.id === mascotaId)
    if (!mascota) return
    setAsignando(dispositivoId)
    try {
      await mapaApi.asignarDispositivo(dispositivoId, mascotaId)
      toast.success(`Dispositivo asignado a ${mascota.nombre}`)
      recargar()
    } catch {
      toast.error('No se pudo asignar el dispositivo')
    } finally {
      setAsignando(null)
    }
  }

  async function handleDesasignar(d: DispositivoGPS) {
    setAsignando(d.id)
    try {
      await mapaApi.desasignarDispositivo(d.id)
      toast.success('Dispositivo desasignado')
      recargar()
    } catch {
      toast.error('No se pudo desasignar el dispositivo')
    } finally {
      setAsignando(null)
    }
  }

  if (cargando) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    )
  }

  if (dispositivos.length === 0) {
    return (
      <EmptyState
        icon={Cctv}
        titulo="Dispositivos GPS"
        descripcion="No hay dispositivos registrados. Agrega un collar GPS para empezar a rastrear."
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {dispositivos.length} dispositivo{dispositivos.length !== 1 ? 's' : ''}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {dispositivos.map((d) => {
          const mascotaAsignada = mascotas.find((m) => m.id === d.mascotaId)
          return (
            <Card key={d.id} size="sm">
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{d.nombre}</h3>
                    <p className="text-xs text-muted-foreground">{d.modelo}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                      d.estado === 'conectado'
                        ? 'border-safe/30 bg-safe/15 text-safe'
                        : d.estado === 'bajo_bateria'
                          ? 'border-caution/30 bg-caution/15 text-caution-foreground'
                          : 'border-border bg-muted text-muted-foreground'
                    }`}
                  >
                    {d.estado === 'conectado' ? (
                      <Wifi className="size-3" />
                    ) : (
                      <WifiOff className="size-3" />
                    )}
                    {estadoLabel[d.estado]}
                  </span>
                </div>

                {/* Batería */}
                <div className="flex items-center gap-2">
                  <Battery className="size-3.5 text-muted-foreground" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${tonoBateria(d.bateria)}`}
                      style={{ width: `${d.bateria}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {d.bateria}%
                  </span>
                </div>

                {/* Señal */}
                <div className="flex items-center gap-2">
                  <Signal className="size-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Última conexión:{' '}
                    {new Date(d.ultimaConexion).toLocaleString('es-CL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Asignación */}
                <div className="flex items-center gap-2">
                  {mascotaAsignada ? (
                    <>
                      <span className="text-xs text-muted-foreground">
                        Asignado a:{' '}
                        <strong className="text-foreground">
                          {mascotaAsignada.nombre}
                        </strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-auto text-muted-foreground hover:text-urgent"
                        onClick={() => handleDesasignar(d)}
                        disabled={asignando === d.id}
                      >
                        {asignando === d.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          'Desasignar'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">
                        Sin asignar
                      </span>
                      <Select
                        value=""
                        onValueChange={(val) => { if (val) handleAsignar(d.id, val) }}
                      >
                        <SelectTrigger
                          size="sm"
                          className="ml-auto w-auto text-xs"
                        >
                          <SelectValue placeholder="Asignar a..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mascotas.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
