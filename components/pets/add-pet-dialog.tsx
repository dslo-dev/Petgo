'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { EspecieMascota } from '@/lib/types'
import { mascotasApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function AddPetDialog({ onCreado }: { onCreado?: () => void }) {
  const { usuario } = useSession()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState<EspecieMascota>('perro')
  const [raza, setRaza] = useState('')
  const [descripcionFisica, setDescripcionFisica] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [collarId, setCollarId] = useState('')
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    try {
      await mascotasApi.crear({
        usuarioId: usuario?.id,
        nombre,
        especie,
        raza,
        descripcionFisica: descripcionFisica || undefined,
        fotoUrl: fotoUrl || undefined,
        collarId: collarId || undefined,
      })
      toast.success(`${nombre} fue agregada`)
      setOpen(false)
      setNombre('')
      setRaza('')
      setDescripcionFisica('')
      setFotoUrl('')
      setCollarId('')
      onCreado?.()
    } catch {
      toast.error('No se pudo agregar la mascota')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" /> Agregar mascota
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif">Nueva mascota</DialogTitle>
            <DialogDescription>
              Registra a tu mascota y vincula su collar GPS.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-nombre">Nombre</Label>
              <Input
                id="np-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Cometa"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="np-especie">Especie</Label>
                <Select
                  value={especie}
                  onValueChange={(v) => setEspecie(v as EspecieMascota)}
                >
                  <SelectTrigger id="np-especie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perro">Perro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="np-raza">Raza</Label>
                <Input
                  id="np-raza"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej. Labrador"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-descripcion">
                Descripción física{' '}
                <span className="text-muted-foreground">
                  ({descripcionFisica.length}/150)
                </span>
              </Label>
              <Textarea
                id="np-descripcion"
                value={descripcionFisica}
                onChange={(e) => setDescripcionFisica(e.target.value)}
                placeholder="Ej. Mancha negra en el lomo, collar azul..."
                maxLength={150}
                className="min-h-20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-foto">URL de la foto (opcional)</Label>
              <Input
                id="np-foto"
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-collar">ID del collar (opcional)</Label>
              <Input
                id="np-collar"
                value={collarId}
                onChange={(e) => setCollarId(e.target.value)}
                placeholder="SYS-000"
                className="font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={cargando || !nombre}>
              {cargando && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
