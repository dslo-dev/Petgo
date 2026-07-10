// Tipos compartidos por toda la app. Reflejan la forma de datos que
// devolverá el backend real (o el mock equivalente mientras no exista).

export interface Usuario {
  id: string
  nombre: string
  email: string
  avatarUrl?: string
  telefono?: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export type EspecieMascota = 'perro' | 'gato' | 'otro'
export type EstadoCollar = 'conectado' | 'desconectado' | 'bajo_bateria'

export interface Mascota {
  id: string
  usuarioId: string
  nombre: string
  especie: EspecieMascota
  raza: string
  edad?: number
  fotoUrl?: string
  descripcionFisica?: string
  collarId?: string
  grupoId?: string
  estadoCollar: EstadoCollar
  bateria: number // 0-100
  senal: number // 0-100
}

export interface Localizacion {
  id: string
  mascotaId: string
  lat: number
  lng: number
  precision: number // metros
  timestamp: string // ISO
}

// --- Mock: geovallas (zona segura) ---
export interface Geovalla {
  mascotaId: string
  centroLat: number
  centroLng: number
  radio: number // metros
  activa: boolean
  dentroDeZona: 'dentro' | 'fuera' | 'limite'
}

// --- Mock: historial médico ---
export interface RegistroMedico {
  id: string
  mascotaId: string
  tipo: 'vacuna' | 'alergia' | 'visita'
  titulo: string
  detalle: string
  fecha: string // ISO
}

// --- Grupos familiares (backend real) ---
export type RolMiembro = 'dueño' | 'editor' | 'lector'

export interface GrupoFamiliar {
  id: string
  nombre: string
  descripcion?: string
  ubicacion?: string
  fotoUrl?: string
  duenoId: string
}

export interface Miembro {
  id: string
  grupoId: string
  usuarioId: string
  nombre: string
  email: string
  avatarUrl?: string
  rol: RolMiembro
}

export interface Invitacion {
  id: string
  grupoId: string
  grupoNombre: string
  invitadoPor: string
  email: string
  estado: 'pendiente' | 'aceptada' | 'rechazada'
  fecha: string
}

// --- Mock: reportes comunitarios ---
export type TipoReporte = 'perdida' | 'encontrada' | 'avistada'

export interface Reporte {
  id: string
  tipo: TipoReporte
  nombreMascota: string
  descripcion: string
  fotoUrl: string
  distanciaKm: number
  recompensa?: number
  autor: string
  fecha: string
}

// --- Mock: notificaciones ---
export type TipoNotificacion =
  | 'salida_zona'
  | 'mascota_cerca'
  | 'nuevo_reporte'
  | 'bateria_baja'
  | 'sistema'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  fecha: string // ISO
  leida: boolean
}

// --- Mock: membresías ---
export interface PlanMembresia {
  id: string
  nombre: string
  precioMensual: number
  descripcion: string
  caracteristicas: string[]
  destacado?: boolean
}

// --- Mapa: dispositivos GPS ---
export interface DispositivoGPS {
  id: string
  collarId: string
  mascotaId?: string
  nombre: string
  modelo: string
  estado: 'conectado' | 'desconectado' | 'bajo_bateria'
  bateria: number
  ultimaConexion: string
  activo: boolean
}

// --- Mapa: zona segura ---
export interface ZonaSegura {
  id: string
  mascotaId: string
  nombre: string
  centroLat: number
  centroLng: number
  radio: number
  activa: boolean
  notificarSalida: boolean
  color?: string
}

// --- Mapa: recorridos ---
export interface PuntoRecorrido {
  lat: number
  lng: number
  timestamp: string
}

export interface Recorrido {
  id: string
  mascotaId: string
  mascotaNombre: string
  fecha: string
  puntos: PuntoRecorrido[]
  distanciaKm: number
  duracionMin: number
}
