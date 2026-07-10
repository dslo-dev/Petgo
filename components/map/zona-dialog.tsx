'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { type ZonaSegura, type Mascota } from '@/lib/types'
import { mapaApi } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export function ZonaDialog({
  open,
  onOpenChange,
  zona,
  mascotas,
  onGuardado,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  zona: ZonaSegura | null
  mascotas: Mascota[]
  onGuardado: () => void
}) {
  const esEdicion = !!zona
  const [nombre, setNombre] = useState('')
  const [mascotaId, setMascotaId] = useState('')
  const [radio, setRadio] = useState('150')
  const [activa, setActiva] = useState(true)
  const [notificarSalida, setNotificarSalida] = useState(true)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (open) {
      if (zona) {
        setNombre(zona.nombre)
        setMascotaId(zona.mascotaId)
        setRadio(String(zona.radio))
        setActiva(zona.activa)
        setNotificarSalida(zona.notificarSalida)
      } else {
        setNombre('')
        setMascotaId(mascotas[0]?.id ?? '')
        setRadio('150')
        setActiva(true)
        setNotificarSalida(true)
      }
    }
  }, [open, zona, mascotas])

  async function handleSubmit() {
    if (!nombre.trim() || !mascotaId) {
      toast.error('Completa todos los campos requeridos')
      return
    }
    const data = {
      nombre: nombre.trim(),
      mascotaId,
      centroLat: -33.4489,
      centroLng: -70.6693,
      radio: Number(radio),
      activa,
      notificarSalida,
    }

    setCargando(true)
    try {
      if (esEdicion) {
        await mapaApi.actualizarZona(zona!.id, data)
        toast.success('Zona actualizada')
      } else {
        await mapaApi.crearZona(data)
        toast.success('Zona creada')
      }
      onGuardado()
    } catch {
      toast.error('No se pudo guardar la zona')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {esEdicion ? 'Editar zona segura' : 'Nueva zona segura'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Casa - Cometa"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mascota">Mascota</Label>
            <Select value={mascotaId} onValueChange={(v) => { if (v) setMascotaId(v) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una mascota" />
              </SelectTrigger>
              <SelectContent>
                {mascotas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="radio">Radio (metros)</Label>
            <Input
              id="radio"
              type="number"
              min={10}
              max={5000}
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="activa">Zona activa</Label>
            <Switch
              id="activa"
              checked={activa}
              onCheckedChange={setActiva}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notificar">Notificar salida</Label>
            <Switch
              id="notificar"
              checked={notificarSalida}
              onCheckedChange={setNotificarSalida}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={cargando}>
            {esEdicion ? 'Guardar cambios' : 'Crear zona'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
