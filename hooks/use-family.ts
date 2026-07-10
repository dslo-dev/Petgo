'use client'

import { useCallback, useEffect, useState } from 'react'
import type { GrupoFamiliar, Miembro, Invitacion, Mascota } from '@/lib/types'
import { gruposApi, mascotasApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'

export function useFamilyGroups() {
  const { usuario } = useSession()
  const [grupos, setGrupos] = useState<GrupoFamiliar[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!usuario) return
    setCargando(true)
    setError(null)
    try {
      const data = await gruposApi.misGrupos(usuario.id)
      setGrupos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar grupos')
    } finally {
      setCargando(false)
    }
  }, [usuario])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { grupos, cargando, error, recargar }
}

export function useGrupoDetalle(grupoId: string | null) {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [cargando, setCargando] = useState(false)

  const recargar = useCallback(async () => {
    if (!grupoId) return
    setCargando(true)
    try {
      const [m, i, pets] = await Promise.all([
        gruposApi.miembros(grupoId),
        gruposApi.invitacionesPendientes(grupoId),
        gruposApi.mascotasDelGrupo(grupoId),
      ])
      setMiembros(m)
      setInvitaciones(i)
      setMascotas(pets)
    } catch {
      // ignore
    } finally {
      setCargando(false)
    }
  }, [grupoId])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { miembros, invitaciones, mascotas, cargando, recargar, setMascotas }
}

export function useTodasLasMascotas() {
  const { usuario } = useSession()
  const [pets, setPets] = useState<Mascota[]>([])

  const recargar = useCallback(async () => {
    if (!usuario) return
    try {
      const todas = await mascotasApi.listar(usuario.id)
      setPets(todas)
    } catch {
      // ignore
    }
  }, [usuario])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { pets, recargar }
}
