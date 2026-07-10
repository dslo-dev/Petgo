'use client'

// 100% MOCK: las geovallas (zona segura) no existen aún en el backend.
// Se guardan en localStorage para persistir entre recargas. Cuando exista el
// endpoint real, reemplazar la lectura/escritura aquí sin tocar la UI.

import { useCallback, useEffect, useState } from 'react'
import type { Geovalla } from '@/lib/types'
import { mockGeovallas } from '@/lib/mock-data'

const STORAGE_KEY = 'sys_geovallas'

function leerTodas(): Record<string, Geovalla> {
  if (typeof window === 'undefined') return mockGeovallas
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return mockGeovallas
  try {
    return { ...mockGeovallas, ...JSON.parse(raw) }
  } catch {
    return mockGeovallas
  }
}

function guardarTodas(data: Record<string, Geovalla>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useGeofence(mascotaId: string) {
  const [geovalla, setGeovalla] = useState<Geovalla | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const todas = leerTodas()
    setGeovalla(
      todas[mascotaId] ?? {
        mascotaId,
        centroLat: -33.4489,
        centroLng: -70.6693,
        radio: 150,
        activa: false,
        dentroDeZona: 'dentro',
      },
    )
    setCargando(false)
  }, [mascotaId])

  const actualizar = useCallback(
    (cambios: Partial<Geovalla>) => {
      setGeovalla((prev) => {
        if (!prev) return prev
        const siguiente = { ...prev, ...cambios }
        const todas = leerTodas()
        todas[mascotaId] = siguiente
        guardarTodas(todas)
        return siguiente
      })
    },
    [mascotaId],
  )

  return { geovalla, cargando, actualizar }
}
