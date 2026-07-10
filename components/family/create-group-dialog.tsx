'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { gruposApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateGroupDialog({
  open,
  onOpenChange,
  onCreado,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreado: () => void
}) {
  const { usuario } = useSession()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario || !nombre.trim()) return
    setCargando(true)
    try {
      await gruposApi.crear({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        ubicacion: ubicacion.trim() || undefined,
        fotoUrl: fotoUrl.trim() || undefined,
        duenoId: usuario.id,
      })
      toast.success(`Grupo "${nombre}" creado`)
      setNombre('')
      setDescripcion('')
      setUbicacion('')
      setFotoUrl('')
      onCreado()
    } catch {
      toast.error('No se pudo crear el grupo')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif">Crear grupo familiar</DialogTitle>
            <DialogDescription>
              Crea un grupo para compartir el cuidado de tus mascotas.
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-nombre">Nombre del grupo</Label>
              <Input
                id="cg-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Familia Rojas"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-descripcion">Descripción</Label>
              <Textarea
                id="cg-descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej. Nuestra familia unida cuidando a nuestras mascotas."
                className="min-h-20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-ubicacion">Ubicación</Label>
              <Input
                id="cg-ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ej. Santiago, Chile"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-foto">URL de foto del grupo (opcional)</Label>
              <Input
                id="cg-foto"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto-familiar.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={cargando || !nombre.trim()}>
              {cargando && <Loader2 className="size-4 animate-spin" />}
              Crear grupo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
