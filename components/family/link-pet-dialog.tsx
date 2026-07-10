'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Mascota } from '@/lib/types'
import { gruposApi } from '@/lib/api'
import { useTodasLasMascotas } from '@/hooks/use-family'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LinkPetDialog({
  open,
  onOpenChange,
  grupoId,
  onVinculado,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  grupoId: string | null
  onVinculado: () => void
}) {
  const { pets, recargar } = useTodasLasMascotas()
  const [vinculando, setVinculando] = useState<string | null>(null)

  async function vincular(pet: Mascota) {
    if (!grupoId) return
    setVinculando(pet.id)
    try {
      await gruposApi.agregarMascota(pet.id, grupoId)
      toast.success(`${pet.nombre} fue vinculada al grupo`)
      recargar()
      onVinculado()
    } catch {
      toast.error('No se pudo vincular la mascota')
    } finally {
      setVinculando(null)
    }
  }

  async function desvincular(pet: Mascota) {
    if (!grupoId) return
    setVinculando(pet.id)
    try {
      await gruposApi.quitarMascota(pet.id)
      toast.success(`${pet.nombre} fue desvinculada del grupo`)
      recargar()
      onVinculado()
    } catch {
      toast.error('No se pudo desvincular la mascota')
    } finally {
      setVinculando(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Vincular mascota</DialogTitle>
          <DialogDescription>
            Todas tus mascotas registradas. Las que ya están en este grupo tienen un check.
          </DialogDescription>
        </DialogHeader>
        <div className="my-5 flex flex-col gap-2">
          {pets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tienes mascotas registradas.
            </p>
          ) : (
            pets.map((pet) => {
              const enEsteGrupo = pet.grupoId === grupoId
              const enOtroGrupo = pet.grupoId && pet.grupoId !== grupoId
              return (
                <div
                  key={pet.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pet.fotoUrl || '/placeholder.svg?height=36&width=36&query=pet'}
                      alt={pet.nombre}
                      className="size-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{pet.nombre}</p>
                      <p className="text-xs text-muted-foreground">{pet.raza}</p>
                    </div>
                  </div>
                  {enEsteGrupo ? (
                    <span className="flex items-center gap-1.5 text-xs text-safe">
                      <CheckCircle2 className="size-4" /> Vinculada
                    </span>
                  ) : enOtroGrupo ? (
                    <span className="text-xs text-muted-foreground">
                      En otro grupo
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => vincular(pet)}
                      disabled={vinculando === pet.id}
                    >
                      {vinculando === pet.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        'Vincular'
                      )}
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
