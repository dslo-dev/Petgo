'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import type { Usuario } from '@/lib/types'
import {
  authApi,
  getToken,
  getStoredUser,
  setSession,
  clearSession,
} from '@/lib/api'

interface SessionContextValue {
  usuario: Usuario | null
  cargando: boolean
  login: (email: string, password: string) => Promise<void>
  registro: (nombre: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Rehidrata la sesión desde localStorage al montar.
    if (getToken()) {
      setUsuario(getStoredUser())
    }
    setCargando(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, usuario } = await authApi.login(email, password)
    setSession(token, usuario)
    setUsuario(usuario)
  }, [])

  const registro = useCallback(
    async (nombre: string, email: string, password: string) => {
      const { token, usuario } = await authApi.registro(nombre, email, password)
      setSession(token, usuario)
      setUsuario(usuario)
    },
    [],
  )

  const logout = useCallback(() => {
    clearSession()
    setUsuario(null)
  }, [])

  return (
    <SessionContext.Provider
      value={{ usuario, cargando, login, registro, logout }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider')
  return ctx
}
