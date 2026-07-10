'use client'

import { useState, useEffect } from 'react'
import { Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { usuarioApi, setSession } from '@/lib/api'
import type { Usuario } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileView() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    usuarioApi.obtenerPerfil().then((u) => {
      setUsuario(u)
      setNombre(u.nombre)
      setEmail(u.email)
      setTelefono(u.telefono ?? '')
      setAvatarUrl(u.avatarUrl ?? '')
      setCargando(false)
    })
  }, [])

  const iniciales =
    usuario?.nombre
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?'

  async function handleGuardar() {
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    setGuardando(true)
    try {
      const actualizado = await usuarioApi.actualizarPerfil({
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      })
      setUsuario(actualizado)
      setSession('mock-token', actualizado)
      toast.success('Perfil actualizado')
    } catch {
      toast.error('No se pudo actualizar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Perfil
        </h1>
        <p className="text-sm text-muted-foreground">
          Tu información personal y configuración de la cuenta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-16 border-2 border-border">
                <AvatarImage src={avatarUrl || '/placeholder.svg'} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {iniciales}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <Camera className="size-3" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {usuario?.nombre}
              </p>
              <p className="text-xs text-muted-foreground">{usuario?.email}</p>
            </div>
          </div>

          <Separator />

          {/* Formulario */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">URL del avatar</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 XXXX XXXX"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
