'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Mascota } from '@/lib/types'
import { mascotasApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'

export function usePets() {
  const { usuario } = useSession()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!usuario) return
    setCargando(true)
    setError(null)
    try {
      const data = await mascotasApi.listar(usuario.id)
      setMascotas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mascotas')
    } finally {
      setCargando(false)
    }
  }, [usuario])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { mascotas, cargando, error, recargar }
}

export function usePet(id: string) {
  const [mascota, setMascota] = useState<Mascota | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setMascota(await mascotasApi.obtener(id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la mascota')
    } finally {
      setCargando(false)
    }
  }, [id])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { mascota, cargando, error, recargar, setMascota }
}
