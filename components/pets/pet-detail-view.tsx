'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  Syringe,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { usePet } from '@/hooks/use-pets'
import { useGeofence } from '@/hooks/use-geofence'
import { mascotasApi } from '@/lib/api'
import type { EspecieMascota, Mascota } from '@/lib/types'
import { ZonaBadge } from '@/components/status-badge'
import { MetricBar } from '@/components/metric-bar'
import { EmptyState } from '@/components/empty-state'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const especieLabel: Record<Mascota['especie'], string> = {
  perro: 'Perro',
  gato: 'Gato',
  otro: 'Otro',
}

export function PetDetailView({ id }: { id: string }) {
  const router = useRouter()
  const { mascota, cargando, error, setMascota } = usePet(id)
  const { geovalla } = useGeofence(id)

  const [editOpen, setEditOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState<EspecieMascota>('perro')
  const [raza, setRaza] = useState('')
  const [descripcionFisica, setDescripcionFisica] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [collarId, setCollarId] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [borrando, setBorrando] = useState(false)

  function abrirEdit() {
    if (!mascota) return
    setNombre(mascota.nombre)
    setEspecie(mascota.especie)
    setRaza(mascota.raza)
    setDescripcionFisica(mascota.descripcionFisica ?? '')
    setFotoUrl(mascota.fotoUrl ?? '')
    setCollarId(mascota.collarId ?? '')
    setEditOpen(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    try {
      const actualizada = await mascotasApi.actualizar(id, {
        nombre,
        especie,
        raza,
        descripcionFisica: descripcionFisica || undefined,
        fotoUrl: fotoUrl || undefined,
        collarId: collarId || undefined,
      })
      setMascota(actualizada)
      toast.success('Datos actualizados')
      setEditOpen(false)
    } catch {
      toast.error('No se pudo actualizar')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    setBorrando(true)
    try {
      await mascotasApi.eliminar(id)
      toast.success('Mascota eliminada')
      router.push('/mascotas')
    } catch {
      toast.error('No se pudo eliminar')
      setBorrando(false)
    }
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-56 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (error || !mascota) {
    return (
      <div className="mx-auto max-w-4xl">
        <EmptyState
          icon={ShieldAlert}
          titulo="No se encontró la mascota"
          descripcion={error ?? 'Puede que haya sido eliminada.'}
        >
          <Link href="/mascotas" className={buttonVariants({ variant: 'outline' })}>
            Volver a mascotas
          </Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/mascotas"
        className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-4 -ml-2 text-muted-foreground flex' })}
      >
        <ArrowLeft className="size-4" /> Mascotas
      </Link>

      {/* Encabezado */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 w-full shrink-0 overflow-hidden bg-secondary sm:h-auto sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mascota.fotoUrl || '/placeholder.svg?height=220&width=220&query=pet'}
              alt={`Foto de ${mascota.nombre}`}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">
                  {mascota.nombre}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {especieLabel[mascota.especie]} · {mascota.raza}
                  {mascota.edad ? ` · ${mascota.edad} años` : ''}
                </p>
                {mascota.descripcionFisica && (
                  <p className="mt-1.5 text-sm text-muted-foreground/80">
                    {mascota.descripcionFisica}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={abrirEdit} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDelOpen(true)}
                  aria-label="Eliminar"
                  className="text-urgent hover:text-urgent"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {geovalla && <ZonaBadge dentro={geovalla.dentroDeZona} />}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetricBar tipo="bateria" valor={mascota.bateria} />
              <MetricBar tipo="senal" valor={mascota.senal} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/mascotas/${id}/mapa`}
                className={buttonVariants({ className: 'flex' })}
              >
                <MapPin className="size-4 mr-2"/> Ver en el mapa
              </Link>
              <Link
                href={`/mascotas/${id}/historial-medico`}
                className={buttonVariants({ variant: 'outline', className: 'flex' })}
              >
                <Syringe className="size-4 mr-2" /> Ver historial médico
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="zona" className="mt-6">
        <TabsList>
          <TabsTrigger value="zona">Zona segura</TabsTrigger>
        </TabsList>

        <TabsContent value="zona" className="mt-4">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-safe/15 text-safe">
                {geovalla?.dentroDeZona === 'dentro' ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <ShieldAlert className="size-5" />
                )}
              </span>
              <div className="flex-1">
                <p className="font-medium text-foreground">Zona segura</p>
                {geovalla ? (
                  <p className="text-sm text-muted-foreground">
                    Radio de{' '}
                    <span className="font-mono">{geovalla.radio} m</span> ·{' '}
                    {geovalla.activa ? 'activa' : 'inactiva'}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No configurada
                  </p>
                )}
              </div>
            </div>
            <Link
              href={`/mascotas/${id}/zona-segura`}
              className={buttonVariants({ variant: 'outline', className: 'mt-4 w-full flex items-center' })}
            >
              Editar zona segura
              <ChevronRight className="size-4 ml-2" />
            </Link>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogo editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={guardar}>
            <DialogHeader>
              <DialogTitle className="font-serif">Editar mascota</DialogTitle>
              <DialogDescription>
                Actualiza los datos generales de {mascota.nombre}.
              </DialogDescription>
            </DialogHeader>
            <div className="my-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ed-nombre">Nombre</Label>
                <Input
                  id="ed-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Cometa"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ed-especie">Especie</Label>
                  <Select
                    value={especie}
                    onValueChange={(v) => setEspecie(v as EspecieMascota)}
                  >
                    <SelectTrigger id="ed-especie">
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
                  <Label htmlFor="ed-raza">Raza</Label>
                  <Input
                    id="ed-raza"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    placeholder="Ej. Labrador"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ed-descripcion">
                  Descripción física{' '}
                  <span className="text-muted-foreground">
                    ({descripcionFisica.length}/150)
                  </span>
                </Label>
                <Textarea
                  id="ed-descripcion"
                  value={descripcionFisica}
                  onChange={(e) => setDescripcionFisica(e.target.value)}
                  placeholder="Ej. Mancha negra en el lomo, collar azul..."
                  maxLength={150}
                  className="min-h-20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ed-foto">URL de la foto (opcional)</Label>
                <Input
                  id="ed-foto"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ed-collar">ID del collar (opcional)</Label>
                <Input
                  id="ed-collar"
                  value={collarId}
                  onChange={(e) => setCollarId(e.target.value)}
                  placeholder="SYS-000"
                  className="font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={guardando}>
                {guardando && <Loader2 className="size-4 animate-spin" />}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogo eliminar */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Eliminar mascota</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará a {mascota.nombre} y
              su collar quedará desvinculado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDelOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={eliminar}
              disabled={borrando}
              className="bg-urgent text-urgent-foreground hover:bg-urgent/90"
            >
              {borrando && <Loader2 className="size-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
