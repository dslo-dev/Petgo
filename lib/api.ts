// ============================================================================
// CLIENTE API CENTRALIZADO
// ----------------------------------------------------------------------------
// Todas las llamadas al backend real pasan por aquí. Apuntan a
// NEXT_PUBLIC_API_URL (default http://localhost:3001/api/v1). Como el preview
// de v0 no puede alcanzar el backend local, cada método real envuelve el fetch
// en un try/catch que cae a datos mock equivalentes si falla, para que la UI
// siempre sea funcional. Esos fallbacks están marcados con:
//   // fallback mock si no hay backend disponible
// ============================================================================

import type {
  AuthResponse,
  Usuario,
  Mascota,
  Localizacion,
  GrupoFamiliar,
  Miembro,
  Invitacion,
  DispositivoGPS,
  ZonaSegura,
  Recorrido,
} from './types'
import {
  mockUsuario,
  mockLocalizaciones,
  mockGruposMutables,
  mockMiembrosMutables,
  mockInvitacionesMutables,
  mockMascotasMutables,
  mockDispositivosMutables,
  mockZonasSegurasMutables,
  mockRecorridosMutables,
  reiniciarMock,
} from './mock-data'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

const TOKEN_KEY = 'sys_token'
const USER_KEY = 'sys_user'

// --- Sesión (token + usuario) en localStorage ---
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setSession(token: string, usuario: Usuario) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function getStoredUser(): Usuario | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as Usuario) : null
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}

// --- fetch base con Authorization y timeout corto ---
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message ?? `Error ${res.status}`)
    }
    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms))
}

// ============================================================================
// AUTENTICACIÓN (backend real)
// ============================================================================
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      return await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      if (!email || !password) throw new Error('Credenciales inválidas')
      return {
        token: 'mock-token',
        usuario: { ...mockUsuario, email },
      }
    }
  },

  async registro(
    nombre: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      return await apiFetch<AuthResponse>('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return {
        token: 'mock-token',
        usuario: { ...mockUsuario, nombre, email },
      }
    }
  },
}

// ============================================================================
// PERFIL DE USUARIO (backend real)
// ============================================================================
export const usuarioApi = {
  async obtenerPerfil(): Promise<Usuario> {
    try {
      return await apiFetch<Usuario>('/usuario/perfil')
    } catch {
      await delay()
      return { ...mockUsuario }
    }
  },

  async actualizarPerfil(data: Partial<Usuario>): Promise<Usuario> {
    try {
      return await apiFetch<Usuario>('/usuario/perfil', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    } catch {
      await delay()
      const actualizado = { ...mockUsuario, ...data }
      Object.assign(mockUsuario, actualizado)
      return actualizado
    }
  },
}

// ============================================================================
// MASCOTAS (backend real)
// ============================================================================
export const mascotasApi = {
  async listar(usuarioId: string): Promise<Mascota[]> {
    try {
      return await apiFetch<Mascota[]>(`/mascotas?usuarioId=${usuarioId}`)
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return mockMascotasMutables.filter((m) => m.usuarioId === usuarioId)
    }
  },

  async obtener(id: string): Promise<Mascota> {
    try {
      return await apiFetch<Mascota>(`/mascotas/${id}`)
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const m = mockMascotasMutables.find((p) => p.id === id)
      if (!m) throw new Error('Mascota no encontrada')
      return m
    }
  },

  async crear(data: Partial<Mascota>): Promise<Mascota> {
    try {
      return await apiFetch<Mascota>('/mascotas', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const nueva: Mascota = {
        id: `m-${Date.now()}`,
        usuarioId: data.usuarioId ?? 'u-1',
        nombre: data.nombre ?? 'Sin nombre',
        especie: data.especie ?? 'perro',
        raza: data.raza ?? '',
        edad: data.edad,
        fotoUrl: data.fotoUrl,
        descripcionFisica: data.descripcionFisica,
        collarId: data.collarId,
        estadoCollar: 'desconectado',
        bateria: 0,
        senal: 0,
      }
      mockMascotasMutables.push(nueva)
      return nueva
    }
  },

  async actualizar(id: string, data: Partial<Mascota>): Promise<Mascota> {
    try {
      return await apiFetch<Mascota>(`/mascotas/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const m = mockMascotasMutables.find((p) => p.id === id)
      return { ...(m as Mascota), ...data }
    }
  },

  async eliminar(id: string): Promise<void> {
    try {
      await apiFetch<void>(`/mascotas/${id}`, { method: 'DELETE' })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
    }
  },
}

// ============================================================================
// LOCALIZACIÓN (backend real)
// ============================================================================
export const localizacionApi = {
  async ultima(mascotaId: string): Promise<Localizacion | null> {
    try {
      const list = await apiFetch<Localizacion[]>(
        `/localizacion?mascotaId=${mascotaId}`,
      )
      return list.at(-1) ?? null
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return mockLocalizaciones[mascotaId] ?? null
    }
  },
}

// ============================================================================
// GRUPOS FAMILIARES / MIEMBROS / INVITACIONES (backend real)
// ============================================================================
export const gruposApi = {
  async misGrupos(usuarioId: string): Promise<GrupoFamiliar[]> {
    try {
      return await apiFetch<GrupoFamiliar[]>(
        `/grupos?usuarioId=${usuarioId}`,
      )
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const ids = new Set(mockMiembrosMutables.filter((m) => m.usuarioId === usuarioId).map((m) => m.grupoId))
      return mockGruposMutables.filter((g) => g.duenoId === usuarioId || ids.has(g.id))
    }
  },

  async crear(data: { nombre: string; descripcion?: string; ubicacion?: string; fotoUrl?: string; duenoId: string }): Promise<GrupoFamiliar> {
    try {
      return await apiFetch<GrupoFamiliar>('/grupos', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const nuevo: GrupoFamiliar = {
        id: `g-${Date.now()}`,
        nombre: data.nombre,
        descripcion: data.descripcion,
        ubicacion: data.ubicacion,
        fotoUrl: data.fotoUrl,
        duenoId: data.duenoId,
      }
      mockGruposMutables.push(nuevo)
      mockMiembrosMutables.push({
        id: `mi-${Date.now()}`,
        grupoId: nuevo.id,
        usuarioId: data.duenoId,
        nombre: mockUsuario.nombre,
        email: mockUsuario.email,
        rol: 'dueño',
      })
      return nuevo
    }
  },

  async miembros(grupoId: string): Promise<Miembro[]> {
    try {
      return await apiFetch<Miembro[]>(`/miembros/grupo/${grupoId}`)
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return mockMiembrosMutables.filter((m) => m.grupoId === grupoId)
    }
  },

  async invitar(grupoId: string, email: string, grupoNombre: string): Promise<Invitacion> {
    try {
      return await apiFetch<Invitacion>('/invitaciones', {
        method: 'POST',
        body: JSON.stringify({ grupoId, email }),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const inv: Invitacion = {
        id: `inv-${Date.now()}`,
        grupoId,
        grupoNombre,
        invitadoPor: mockUsuario.nombre,
        email,
        estado: 'pendiente',
        fecha: new Date().toISOString(),
      }
      mockInvitacionesMutables.push(inv)
      return inv
    }
  },

  async invitacionesPendientes(grupoId: string): Promise<Invitacion[]> {
    try {
      return await apiFetch<Invitacion[]>('/invitaciones/pendientes')
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return mockInvitacionesMutables.filter(
        (i) => i.grupoId === grupoId && i.estado === 'pendiente',
      )
    }
  },

  async responderInvitacion(
    id: string,
    accion: 'aceptar' | 'rechazar',
  ): Promise<void> {
    try {
      await apiFetch<void>(`/invitaciones/${id}/${accion}`, { method: 'POST' })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const idx = mockInvitacionesMutables.findIndex((i) => i.id === id)
      if (idx !== -1) {
        mockInvitacionesMutables[idx].estado = accion === 'aceptar' ? 'aceptada' : 'rechazada'
      }
    }
  },

  async mascotasDelGrupo(grupoId: string): Promise<Mascota[]> {
    try {
      return await apiFetch<Mascota[]>(`/mascotas?grupoId=${grupoId}`)
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      return mockMascotasMutables.filter((m) => m.grupoId === grupoId)
    }
  },

  async agregarMascota(mascotaId: string, grupoId: string): Promise<void> {
    try {
      await apiFetch<void>(`/mascotas/${mascotaId}/grupo`, {
        method: 'PATCH',
        body: JSON.stringify({ grupoId }),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const m = mockMascotasMutables.find((p) => p.id === mascotaId)
      if (m) m.grupoId = grupoId
    }
  },

  async quitarMascota(mascotaId: string): Promise<void> {
    try {
      await apiFetch<void>(`/mascotas/${mascotaId}/grupo`, {
        method: 'DELETE',
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const m = mockMascotasMutables.find((p) => p.id === mascotaId)
      if (m) m.grupoId = undefined
    }
  },

  async cambiarRol(miembroId: string, rol: string): Promise<void> {
    try {
      await apiFetch<void>('/miembros/rol', {
        method: 'PATCH',
        body: JSON.stringify({ miembroId, rol }),
      })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
    }
  },

  async expulsar(miembroId: string): Promise<void> {
    try {
      await apiFetch<void>(`/miembros/${miembroId}`, { method: 'DELETE' })
    } catch {
      // fallback mock si no hay backend disponible
      await delay()
      const idx = mockMiembrosMutables.findIndex((m) => m.id === miembroId)
      if (idx !== -1) mockMiembrosMutables.splice(idx, 1)
    }
  },
}

// ============================================================================
// MAPA: DISPOSITIVOS, ZONAS SEGURAS, RECORRIDOS (backend real)
// ============================================================================
export const mapaApi = {
  // --- Dispositivos GPS ---
  async listarDispositivos(): Promise<DispositivoGPS[]> {
    try {
      return await apiFetch<DispositivoGPS[]>('/dispositivos')
    } catch {
      await delay()
      return mockDispositivosMutables
    }
  },

  async asignarDispositivo(
    dispositivoId: string,
    mascotaId: string,
  ): Promise<DispositivoGPS> {
    try {
      return await apiFetch<DispositivoGPS>(
        `/dispositivos/${dispositivoId}/asignar`,
        {
          method: 'PATCH',
          body: JSON.stringify({ mascotaId }),
        },
      )
    } catch {
      await delay()
      const d = mockDispositivosMutables.find((x) => x.id === dispositivoId)
      if (!d) throw new Error('Dispositivo no encontrado')
      d.mascotaId = mascotaId
      d.activo = true
      return { ...d }
    }
  },

  async desasignarDispositivo(dispositivoId: string): Promise<DispositivoGPS> {
    try {
      return await apiFetch<DispositivoGPS>(
        `/dispositivos/${dispositivoId}/asignar`,
        {
          method: 'PATCH',
          body: JSON.stringify({ mascotaId: null }),
        },
      )
    } catch {
      await delay()
      const d = mockDispositivosMutables.find((x) => x.id === dispositivoId)
      if (!d) throw new Error('Dispositivo no encontrado')
      d.mascotaId = undefined
      d.activo = false
      return { ...d }
    }
  },

  // --- Zonas seguras ---
  async listarZonas(): Promise<ZonaSegura[]> {
    try {
      return await apiFetch<ZonaSegura[]>('/zonas-seguras')
    } catch {
      await delay()
      return mockZonasSegurasMutables
    }
  },

  async crearZona(
    data: Omit<ZonaSegura, 'id'>,
  ): Promise<ZonaSegura> {
    try {
      return await apiFetch<ZonaSegura>('/zonas-seguras', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch {
      await delay()
      const nueva: ZonaSegura = {
        ...data,
        id: `z-${Date.now()}`,
      }
      mockZonasSegurasMutables.push(nueva)
      return nueva
    }
  },

  async actualizarZona(
    id: string,
    data: Partial<ZonaSegura>,
  ): Promise<ZonaSegura> {
    try {
      return await apiFetch<ZonaSegura>(`/zonas-seguras/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    } catch {
      await delay()
      const idx = mockZonasSegurasMutables.findIndex((z) => z.id === id)
      if (idx === -1) throw new Error('Zona no encontrada')
      mockZonasSegurasMutables[idx] = { ...mockZonasSegurasMutables[idx], ...data }
      return mockZonasSegurasMutables[idx]
    }
  },

  async eliminarZona(id: string): Promise<void> {
    try {
      await apiFetch<void>(`/zonas-seguras/${id}`, { method: 'DELETE' })
    } catch {
      await delay()
      const idx = mockZonasSegurasMutables.findIndex((z) => z.id === id)
      if (idx !== -1) mockZonasSegurasMutables.splice(idx, 1)
    }
  },

  // --- Recorridos ---
  async listarRecorridos(mascotaId?: string): Promise<Recorrido[]> {
    try {
      const qs = mascotaId ? `?mascotaId=${mascotaId}` : ''
      return await apiFetch<Recorrido[]>(`/recorridos${qs}`)
    } catch {
      await delay()
      let lista = mockRecorridosMutables
      if (mascotaId) lista = lista.filter((r) => r.mascotaId === mascotaId)
      return lista
    }
  },

  async obtenerRecorrido(id: string): Promise<Recorrido> {
    try {
      return await apiFetch<Recorrido>(`/recorridos/${id}`)
    } catch {
      await delay()
      const r = mockRecorridosMutables.find((x) => x.id === id)
      if (!r) throw new Error('Recorrido no encontrado')
      return r
    }
  },
}
