'use client'

import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import type { GrupoFamiliar } from '@/lib/types'
import { gruposApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function InviteDialog({
  open,
  onOpenChange,
  grupo,
  onInvitado,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  grupo: GrupoFamiliar | null
  onInvitado: () => void
}) {
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!grupo || !email.trim()) return
    setCargando(true)
    try {
      await gruposApi.invitar(grupo.id, email.trim(), grupo.nombre)
      toast.success(`Invitación enviada a ${email}`)
      setEmail('')
      onInvitado()
    } catch {
      toast.error('No se pudo enviar la invitación')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="font-serif">Invitar miembro</DialogTitle>
            <DialogDescription>
              Envía una invitación por correo para unirse a {grupo?.nombre}.
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-email">Correo electrónico</Label>
              <Input
                id="inv-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={cargando || !email.trim()}>
              {cargando && <Loader2 className="size-4 animate-spin" />}
              <Mail className="size-4" /> Enviar invitación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
