'use client'

import { useEffect, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { gruposApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'
import { useFamilyGroups, useGrupoDetalle } from '@/hooks/use-family'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { CreateGroupDialog } from './create-group-dialog'
import { InviteDialog } from './invite-dialog'
import { LinkPetDialog } from './link-pet-dialog'
import { GroupDetailCard } from './group-detail-card'

export function FamilyView() {
  const { usuario } = useSession()
  const { grupos, cargando, recargar } = useFamilyGroups()
  const [grupoActivo, setGrupoActivo] = useState<string | null>(null)
  const { miembros, invitaciones, mascotas, cargando: detCargando, recargar: recargarDet } =
    useGrupoDetalle(grupoActivo)
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [linkPetOpen, setLinkPetOpen] = useState(false)

  useEffect(() => {
    if (grupos.length > 0 && !grupoActivo) {
      setGrupoActivo(grupos[0].id)
    }
  }, [grupos, grupoActivo])

  const grupo = grupos.find((g) => g.id === grupoActivo) ?? grupos[0]
  const esAdmin = grupo?.duenoId === usuario?.id

  if (cargando) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (grupos.length === 0) {
    return (
      <>
        <EmptyState
          icon={Users}
          titulo="Grupos familiares"
          descripcion="Crea un grupo para compartir el cuidado de tus mascotas con otras personas."
        >
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Crear grupo
          </Button>
        </EmptyState>
        <CreateGroupDialog open={createOpen} onOpenChange={setCreateOpen} onCreado={() => { recargar(); setCreateOpen(false) }} />
      </>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Grupos familiares
          </h1>
          <p className="text-sm text-muted-foreground">
            Comparte el cuidado de tus mascotas con tu familia.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" /> Crear grupo
        </Button>
      </div>

      {/* Selector de grupos */}
      {grupos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {grupos.map((g) => (
            <button
              key={g.id}
              onClick={() => setGrupoActivo(g.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                grupoActivo === g.id || (!grupoActivo && g.id === grupos[0].id)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              {g.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Detalle del grupo */}
      {grupo && (
        <GroupDetailCard
          grupo={grupo}
          miembros={miembros}
          invitaciones={invitaciones}
          mascotas={mascotas}
          cargando={detCargando}
          esAdmin={esAdmin}
          onInvite={() => setInviteOpen(true)}
          onLinkPet={() => setLinkPetOpen(true)}
          onRecargar={recargarDet}
        />
      )}

      <CreateGroupDialog open={createOpen} onOpenChange={setCreateOpen} onCreado={() => { recargar(); setCreateOpen(false) }} />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} grupo={grupo ?? null} onInvitado={() => { recargarDet(); setInviteOpen(false) }} />
      <LinkPetDialog open={linkPetOpen} onOpenChange={setLinkPetOpen} grupoId={grupo?.id ?? null} onVinculado={() => { recargarDet(); setLinkPetOpen(false) }} />
    </div>
  )
}
