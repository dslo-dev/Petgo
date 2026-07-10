'use client'

import { useState } from 'react'
import { Users, ShieldCheck, UserPlus, LogOut, PawPrint, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { GrupoFamiliar, Miembro, Invitacion, Mascota } from '@/lib/types'
import { gruposApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const rolLabel: Record<Miembro['rol'], string> = {
  dueño: 'Administrador',
  editor: 'Editor',
  lector: 'Lector',
}

export function GroupDetailCard({
  grupo,
  miembros,
  invitaciones,
  mascotas,
  cargando,
  esAdmin,
  onInvite,
  onLinkPet,
  onRecargar,
}: {
  grupo: GrupoFamiliar
  miembros: Miembro[]
  invitaciones: Invitacion[]
  mascotas: Mascota[]
  cargando: boolean
  esAdmin: boolean
  onInvite: () => void
  onLinkPet: () => void
  onRecargar: () => void
}) {
  const [expulsando, setExpulsando] = useState<string | null>(null)

  async function handleExpulsar(miembro: Miembro) {
    setExpulsando(miembro.id)
    try {
      await gruposApi.expulsar(miembro.id)
      toast.success(`${miembro.nombre} fue eliminado del grupo`)
      onRecargar()
    } catch {
      toast.error('No se pudo eliminar al miembro')
    } finally {
      setExpulsando(null)
    }
  }

  return (
    <Card className="overflow-hidden p-0">
      {grupo.fotoUrl && (
        <div className="relative h-40 w-full overflow-hidden bg-secondary sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={grupo.fotoUrl}
            alt={grupo.nombre}
            className="size-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {grupo.nombre}
            </h2>
            {grupo.descripcion && (
              <p className="mt-0.5 text-sm text-muted-foreground/80">
                {grupo.descripcion}
              </p>
            )}

            <p className="mt-1.5 text-sm text-muted-foreground">
              {miembros.length} miembro{miembros.length !== 1 ? 's' : ''} ·{' '}
              {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''}
            </p>
          </div>
          {esAdmin && (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={onInvite}>
                <UserPlus className="size-4" /> Invitar
              </Button>
              <Button variant="outline" size="sm" onClick={onLinkPet}>
                <PawPrint className="size-4" /> Vincular mascota
              </Button>
            </div>
          )}
        </div>

        {/* Miembros */}
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="size-4" /> Miembros
          </h3>
          {cargando ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {miembros.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {m.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {m.nombre}
                        {m.rol === 'dueño' && (
                          <ShieldCheck className="ml-1.5 inline size-3.5 text-safe" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {rolLabel[m.rol]}
                    </span>
                    {esAdmin && m.rol !== 'dueño' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-urgent"
                        onClick={() => handleExpulsar(m)}
                        disabled={expulsando === m.id}
                      >
                        {expulsando === m.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <LogOut className="size-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mascotas vinculadas */}
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PawPrint className="size-4" /> Mascotas vinculadas
          </h3>
          {cargando ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : mascotas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay mascotas vinculadas a este grupo.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {mascotas.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.fotoUrl || '/placeholder.svg?height=36&width=36&query=pet'}
                      alt={p.nombre}
                      className="size-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">{p.raza}</p>
                    </div>
                  </div>
                  {esAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-urgent"
                      onClick={async () => {
                        try {
                          await gruposApi.quitarMascota(p.id)
                          onRecargar()
                          toast.success(`${p.nombre} fue desvinculada`)
                        } catch {
                          toast.error('No se pudo desvincular la mascota')
                        }
                      }}
                    >
                      Desvincular
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invitaciones pendientes */}
        {invitaciones.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserPlus className="size-4" /> Invitaciones pendientes
            </h3>
            <div className="flex flex-col gap-2">
              {invitaciones.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"
                >
                  <div>
                    <p className="text-sm text-foreground">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Invitado por {inv.invitadoPor}
                    </p>
                  </div>
                  <span className="rounded-full bg-caution/15 px-2.5 py-0.5 font-mono text-[11px] text-caution-foreground">
                    Pendiente
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
