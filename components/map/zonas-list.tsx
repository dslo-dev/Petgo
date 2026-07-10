'use client'

import { useState } from 'react'
import { Plus, Map, ShieldOff, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useZonasSeguras } from '@/hooks/use-map'
import { useDatosMapa } from '@/hooks/use-map'
import { mapaApi } from '@/lib/api'
import { type ZonaSegura } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ZonaBadge } from '@/components/status-badge'
import { ZonaDialog } from './zona-dialog'

export function ZonasList() {
  const { zonas, cargando, recargar } = useZonasSeguras()
  const { mascotas } = useDatosMapa()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<ZonaSegura | null>(null)
  const [eliminando, setEliminando] = useState<string | null>(null)

  async function handleEliminar(id: string) {
    setEliminando(id)
    try {
      await mapaApi.eliminarZona(id)
      toast.success('Zona segura eliminada')
      recargar()
    } catch {
      toast.error('No se pudo eliminar la zona')
    } finally {
      setEliminando(null)
    }
  }

  function handleEdit(zona: ZonaSegura) {
    setEditando(zona)
    setDialogOpen(true)
  }

  function handleCreate() {
    setEditando(null)
    setDialogOpen(true)
  }

  function handleClose() {
    setDialogOpen(false)
    setEditando(null)
  }

  if (cargando) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    )
  }

  if (zonas.length === 0) {
    return (
      <>
        <EmptyState
          icon={Map}
          titulo="Zonas seguras"
          descripcion="Crea una zona segura para recibir alertas cuando tu mascota salga del perímetro."
        >
          <Button onClick={handleCreate}>
            <Plus className="size-4" /> Crear zona
          </Button>
        </EmptyState>
        <ZonaDialog
          open={dialogOpen}
          onOpenChange={handleClose}
          zona={editando}
          mascotas={mascotas}
          onGuardado={() => { recargar(); handleClose() }}
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {zonas.length} zona{zonas.length !== 1 ? 's' : ''} configurada
          {zonas.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="size-4" /> Nueva zona
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {zonas.map((z) => {
          const mascota = mascotas.find((m) => m.id === z.mascotaId)
          return (
            <Card key={z.id} size="sm">
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{z.nombre}</h3>
                    <p className="text-xs text-muted-foreground">
                      {mascota ? mascota.nombre : 'Mascota no encontrada'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleEdit(z)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-urgent"
                      onClick={() => handleEliminar(z.id)}
                      disabled={eliminando === z.id}
                    >
                      {eliminando === z.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Radio: {z.radio} m</span>
                  <span>·</span>
                  <span>
                    {z.activa ? (
                      <span className="text-safe">Activa</span>
                    ) : (
                      <span className="text-muted-foreground">Inactiva</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ZonaBadge dentro="dentro" />
                  {!z.notificarSalida && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldOff className="size-3" /> Sin notificar
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <ZonaDialog
        open={dialogOpen}
        onOpenChange={handleClose}
        zona={editando}
        mascotas={mascotas}
        onGuardado={() => { recargar(); handleClose() }}
      />
    </div>
  )
}
