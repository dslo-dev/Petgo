'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Mascota, Localizacion, DispositivoGPS, ZonaSegura, Recorrido } from '@/lib/types'
import { mascotasApi, localizacionApi, mapaApi } from '@/lib/api'
import { useSession } from '@/components/session-provider'

interface DatosMapa {
  mascotas: Mascota[]
  localizaciones: Record<string, Localizacion | null>
  cargando: boolean
}

export function useDatosMapa() {
  const { usuario } = useSession()
  const [datos, setDatos] = useState<DatosMapa>({
    mascotas: [],
    localizaciones: {},
    cargando: true,
  })

  const recargar = useCallback(async () => {
    if (!usuario) return
    setDatos((prev) => ({ ...prev, cargando: true }))
    try {
      const mascotas = await mascotasApi.listar(usuario.id)
      const locs: Record<string, Localizacion | null> = {}
      await Promise.all(
        mascotas.map(async (m) => {
          locs[m.id] = await localizacionApi.ultima(m.id)
        }),
      )
      setDatos({ mascotas, localizaciones: locs, cargando: false })
    } catch {
      setDatos({ mascotas: [], localizaciones: {}, cargando: false })
    }
  }, [usuario])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...datos, recargar }
}

interface DatosDispositivos {
  dispositivos: DispositivoGPS[]
  cargando: boolean
}

export function useDispositivos() {
  const [datos, setDatos] = useState<DatosDispositivos>({
    dispositivos: [],
    cargando: true,
  })

  const recargar = useCallback(async () => {
    setDatos((prev) => ({ ...prev, cargando: true }))
    try {
      const dispositivos = await mapaApi.listarDispositivos()
      setDatos({ dispositivos, cargando: false })
    } catch {
      setDatos({ dispositivos: [], cargando: false })
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...datos, recargar }
}

interface DatosZonas {
  zonas: ZonaSegura[]
  cargando: boolean
}

export function useZonasSeguras() {
  const [datos, setDatos] = useState<DatosZonas>({
    zonas: [],
    cargando: true,
  })

  const recargar = useCallback(async () => {
    setDatos((prev) => ({ ...prev, cargando: true }))
    try {
      const zonas = await mapaApi.listarZonas()
      setDatos({ zonas, cargando: false })
    } catch {
      setDatos({ zonas: [], cargando: false })
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...datos, recargar }
}

interface DatosRecorridos {
  recorridos: Recorrido[]
  cargando: boolean
}

export function useRecorridos(mascotaId?: string) {
  const [datos, setDatos] = useState<DatosRecorridos>({
    recorridos: [],
    cargando: true,
  })

  const recargar = useCallback(async () => {
    setDatos((prev) => ({ ...prev, cargando: true }))
    try {
      const recorridos = await mapaApi.listarRecorridos(mascotaId)
      setDatos({ recorridos, cargando: false })
    } catch {
      setDatos({ recorridos: [], cargando: false })
    }
  }, [mascotaId])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ...datos, recargar }
}
