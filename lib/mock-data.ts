// ============================================================================
// DATOS MOCK
// ----------------------------------------------------------------------------
// Estos datos simulan lo que devolverá el backend. Los módulos marcados como
// "100% mock" (geovallas, historial médico, reportes, notificaciones,
// membresías) viven SOLO aquí. Los módulos con backend real (usuarios,
// mascotas, localización, grupos) también incluyen un mock equivalente que se
// usa como fallback cuando el fetch al backend falla (ver lib/api.ts).
// ============================================================================

import type {
  Usuario,
  Mascota,
  Localizacion,
  Geovalla,
  RegistroMedico,
  GrupoFamiliar,
  Miembro,
  Invitacion,
  Reporte,
  Notificacion,
  PlanMembresia,
  DispositivoGPS,
  ZonaSegura,
  Recorrido,
} from './types'

export const mockUsuario: Usuario = {
  id: 'u-1',
  nombre: 'Santiago Lopez',
  email: 'eldwigth25@gmail.com',
  avatarUrl: 'https://avatars.githubusercontent.com/u/147568951?v=4&size=64',
  telefono: '+56 9 1234 5678',
}

export const mockMascotas: Mascota[] = [
  {
    id: 'm-1',
    usuarioId: 'u-1',
    grupoId: 'g-1',
    nombre: 'Cometa',
    especie: 'perro',
    raza: 'Border Collie',
    edad: 3,
    descripcionFisica: 'Pelaje negro y blanco, mancha blanca en la frente, ojos marrones.',
    fotoUrl: '/pets/border-collie.png',
    collarId: 'SYS-0A1',
    estadoCollar: 'conectado',
    bateria: 82,
    senal: 91,
  },
  {
    id: 'm-2',
    usuarioId: 'u-1',
    nombre: 'Luna',
    especie: 'gato',
    raza: 'Siamés',
    edad: 2,
    descripcionFisica: 'Pelaje beige claro con máscara y extremidades más oscuras, ojos azules.',
    fotoUrl: '/pets/siamese-cat.png',
    collarId: 'SYS-0B4',
    estadoCollar: 'bajo_bateria',
    bateria: 14,
    senal: 63,
  },
  {
    id: 'm-3',
    usuarioId: 'u-1',
    nombre: 'Rocco',
    especie: 'perro',
    raza: 'Labrador',
    edad: 5,
    descripcionFisica: 'Pelaje dorado claro, complexión robusta, orejas caídas.',
    fotoUrl: '/pets/labrador.png',
    collarId: 'SYS-0C9',
    estadoCollar: 'desconectado',
    bateria: 0,
    senal: 0,
  },
]

export const mockLocalizaciones: Record<string, Localizacion> = {
  'm-1': {
    id: 'loc-1',
    mascotaId: 'm-1',
    lat: -33.4489,
    lng: -70.6693,
    precision: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  'm-2': {
    id: 'loc-2',
    mascotaId: 'm-2',
    lat: -33.4372,
    lng: -70.6506,
    precision: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  'm-3': {
    id: 'loc-3',
    mascotaId: 'm-3',
    lat: -33.4515,
    lng: -70.6712,
    precision: 40,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
}

// --- 100% MOCK: geovallas ---
export const mockGeovallas: Record<string, Geovalla> = {
  'm-1': {
    mascotaId: 'm-1',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 150,
    activa: true,
    dentroDeZona: 'dentro',
  },
  'm-2': {
    mascotaId: 'm-2',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 120,
    activa: true,
    dentroDeZona: 'fuera',
  },
  'm-3': {
    mascotaId: 'm-3',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 200,
    activa: false,
    dentroDeZona: 'limite',
  },
}

// --- 100% MOCK: historial médico ---
const mockHistorialMedico: Record<string, RegistroMedico[]> = {
  'm-1': [
    {
      id: 'med-1',
      mascotaId: 'm-1',
      tipo: 'vacuna',
      titulo: 'Vacuna antirrábica',
      detalle: 'Dosis anual aplicada. Próxima en 12 meses.',
      fecha: '2025-11-02',
    },
    {
      id: 'med-2',
      mascotaId: 'm-1',
      tipo: 'visita',
      titulo: 'Control veterinario',
      detalle: 'Chequeo general, peso 18.2 kg. Todo normal.',
      fecha: '2025-09-14',
    },
    {
      id: 'med-3',
      mascotaId: 'm-1',
      tipo: 'alergia',
      titulo: 'Alergia al polen',
      detalle: 'Estacional. Antihistamínico según indicación.',
      fecha: '2025-03-20',
    },
  ],
  'm-2': [
    {
      id: 'med-4',
      mascotaId: 'm-2',
      tipo: 'vacuna',
      titulo: 'Triple felina',
      detalle: 'Refuerzo aplicado sin reacciones.',
      fecha: '2025-08-01',
    },
  ],
  'm-3': [],
}

// --- Grupos familiares (mock de fallback) ---
export const mockGrupos: GrupoFamiliar[] = [
  {
    id: 'g-1',
    nombre: 'Familia Rojas',
    descripcion: 'Nuestra familia unida cuidando a nuestras mascotas.',
    ubicacion: 'Santiago, Chile',
    fotoUrl: '/familia-feliz.jpg',
    duenoId: 'u-1',
  },
]

export const mockMiembros: Miembro[] = [
  {
    id: 'mi-1',
    grupoId: 'g-1',
    usuarioId: 'u-1',
    nombre: 'Camila Rojas',
    email: 'camila@ejemplo.com',
    rol: 'dueño',
  },
  {
    id: 'mi-2',
    grupoId: 'g-1',
    usuarioId: 'u-2',
    nombre: 'Diego Rojas',
    email: 'diego@ejemplo.com',
    rol: 'editor',
  },
  {
    id: 'mi-3',
    grupoId: 'g-1',
    usuarioId: 'u-3',
    nombre: 'Sofía Rojas',
    email: 'sofia@ejemplo.com',
    rol: 'lector',
  },
]

export const mockInvitaciones: Invitacion[] = [
  {
    id: 'inv-1',
    grupoId: 'g-2',
    grupoNombre: 'Vecinos Ñuñoa',
    invitadoPor: 'Marta Silva',
    email: 'camila@ejemplo.com',
    estado: 'pendiente',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
]

// Variables mutables para mock en runtime
export let mockGruposMutables: GrupoFamiliar[] = [...mockGrupos]
export let mockMiembrosMutables: Miembro[] = [...mockMiembros]
export let mockInvitacionesMutables: Invitacion[] = [...mockInvitaciones]
export let mockMascotasMutables: Mascota[] = JSON.parse(JSON.stringify(mockMascotas))

// --- 100% MOCK: reportes comunitarios ---
const mockReportes: Reporte[] = [
  {
    id: 'r-1',
    tipo: 'perdida',
    nombreMascota: 'Toby',
    descripcion:
      'Perro café de tamaño mediano, collar rojo. Se perdió cerca del parque.',
    fotoUrl: '/pets/lost-brown-dog.png',
    distanciaKm: 0.8,
    recompensa: 50000,
    autor: 'Andrés M.',
    fecha: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'r-2',
    tipo: 'avistada',
    nombreMascota: 'Gato atigrado',
    descripcion: 'Gato atigrado sin collar merodeando por calle Los Olmos.',
    fotoUrl: '/pets/tabby-cat.png',
    distanciaKm: 1.4,
    autor: 'Paula V.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'r-3',
    tipo: 'encontrada',
    nombreMascota: 'Perrita blanca',
    descripcion: 'Encontrada perrita blanca muy dócil, la tengo en resguardo.',
    fotoUrl: '/pets/white-dog.png',
    distanciaKm: 2.1,
    autor: 'Ignacio R.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
]

// --- 100% MOCK: notificaciones ---
const mockNotificaciones: Notificacion[] = [
  {
    id: 'n-1',
    tipo: 'salida_zona',
    titulo: 'Luna salió de la zona segura',
    mensaje: 'Luna cruzó el límite de su zona segura hace 8 minutos.',
    fecha: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    leida: false,
  },
  {
    id: 'n-2',
    tipo: 'bateria_baja',
    titulo: 'Batería baja en el collar de Luna',
    mensaje: 'El collar de Luna está al 14%. Considera cargarlo pronto.',
    fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    leida: false,
  },
  {
    id: 'n-3',
    tipo: 'nuevo_reporte',
    titulo: 'Nuevo reporte cerca de ti',
    mensaje: 'Se reportó una mascota perdida a 800 m de tu ubicación.',
    fecha: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    leida: false,
  },
  {
    id: 'n-4',
    tipo: 'mascota_cerca',
    titulo: 'Cometa cerca de casa',
    mensaje: 'Cometa regresó al centro de su zona segura.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    leida: true,
  },
  {
    id: 'n-5',
    tipo: 'sistema',
    titulo: 'Bienvenida a Sanos y Salvos',
    mensaje: 'Tu cuenta fue creada correctamente. Agrega tu primera mascota.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    leida: true,
  },
]

// --- MOCK: dispositivos GPS ---
export const mockDispositivos: DispositivoGPS[] = [
  {
    id: 'd-1',
    collarId: 'SYS-0A1',
    mascotaId: 'm-1',
    nombre: 'Collar de Cometa',
    modelo: 'GPS-Tracker v3',
    estado: 'conectado',
    bateria: 82,
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    activo: true,
  },
  {
    id: 'd-2',
    collarId: 'SYS-0B4',
    mascotaId: 'm-2',
    nombre: 'Collar de Luna',
    modelo: 'GPS-Tracker v3',
    estado: 'bajo_bateria',
    bateria: 14,
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    activo: true,
  },
  {
    id: 'd-3',
    collarId: 'SYS-0C9',
    mascotaId: 'm-3',
    nombre: 'Collar de Rocco',
    modelo: 'GPS-Tracker v2',
    estado: 'desconectado',
    bateria: 0,
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    activo: false,
  },
  {
    id: 'd-4',
    collarId: 'SYS-0D2',
    mascotaId: undefined,
    nombre: 'Collar de repuesto',
    modelo: 'GPS-Tracker v3',
    estado: 'desconectado',
    bateria: 100,
    ultimaConexion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    activo: false,
  },
]

// --- MOCK: zonas seguras ---
export const mockZonasSeguras: ZonaSegura[] = [
  {
    id: 'z-1',
    mascotaId: 'm-1',
    nombre: 'Casa - Cometa',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 150,
    activa: true,
    notificarSalida: true,
  },
  {
    id: 'z-2',
    mascotaId: 'm-2',
    nombre: 'Casa - Luna',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 120,
    activa: true,
    notificarSalida: true,
  },
  {
    id: 'z-3',
    mascotaId: 'm-3',
    nombre: 'Casa - Rocco',
    centroLat: -33.4489,
    centroLng: -70.6693,
    radio: 200,
    activa: false,
    notificarSalida: false,
  },
]

// --- MOCK: recorridos ---
export const mockRecorridos: Recorrido[] = [
  {
    id: 'r-1',
    mascotaId: 'm-1',
    mascotaNombre: 'Cometa',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    puntos: [
      { lat: -33.4489, lng: -70.6693, timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { lat: -33.4495, lng: -70.6680, timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString() },
      { lat: -33.4502, lng: -70.6670, timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString() },
      { lat: -33.4490, lng: -70.6660, timestamp: new Date(Date.now() - 1000 * 60 * 100).toISOString() },
      { lat: -33.4489, lng: -70.6693, timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    ],
    distanciaKm: 1.2,
    duracionMin: 30,
  },
  {
    id: 'r-2',
    mascotaId: 'm-2',
    mascotaNombre: 'Luna',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    puntos: [
      { lat: -33.4372, lng: -70.6506, timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
      { lat: -33.4380, lng: -70.6515, timestamp: new Date(Date.now() - 1000 * 60 * 290).toISOString() },
      { lat: -33.4390, lng: -70.6520, timestamp: new Date(Date.now() - 1000 * 60 * 280).toISOString() },
      { lat: -33.4372, lng: -70.6506, timestamp: new Date(Date.now() - 1000 * 60 * 270).toISOString() },
    ],
    distanciaKm: 0.8,
    duracionMin: 30,
  },
]

// Variables mutables
export let mockDispositivosMutables: DispositivoGPS[] = JSON.parse(JSON.stringify(mockDispositivos))
export let mockZonasSegurasMutables: ZonaSegura[] = JSON.parse(JSON.stringify(mockZonasSeguras))
export let mockRecorridosMutables: Recorrido[] = JSON.parse(JSON.stringify(mockRecorridos))

export function reiniciarMock() {
  mockGruposMutables = [...mockGrupos]
  mockMiembrosMutables = [...mockMiembros]
  mockInvitacionesMutables = [...mockInvitaciones]
  mockMascotasMutables = JSON.parse(JSON.stringify(mockMascotas))
  mockDispositivosMutables = JSON.parse(JSON.stringify(mockDispositivos))
  mockZonasSegurasMutables = JSON.parse(JSON.stringify(mockZonasSeguras))
  mockRecorridosMutables = JSON.parse(JSON.stringify(mockRecorridos))
}

// --- 100% MOCK: planes de membresía ---
const mockPlanes: PlanMembresia[] = [
  {
    id: 'plan-basico',
    nombre: 'Básico',
    precioMensual: 0,
    descripcion: 'Para empezar a rastrear una mascota.',
    caracteristicas: [
      '1 mascota',
      'Ubicación en tiempo real',
      '1 zona segura',
      'Alertas básicas',
    ],
  },
  {
    id: 'plan-familiar',
    nombre: 'Familiar',
    precioMensual: 6990,
    descripcion: 'Ideal para hogares con varias mascotas.',
    caracteristicas: [
      'Hasta 5 mascotas',
      'Zonas seguras ilimitadas',
      'Grupo familiar compartido',
      'Historial de ubicaciones 30 días',
      'Alertas comunitarias',
    ],
    destacado: true,
  },
  {
    id: 'plan-pro',
    nombre: 'Pro',
    precioMensual: 12990,
    descripcion: 'Máxima cobertura y prioridad de red.',
    caracteristicas: [
      'Mascotas ilimitadas',
      'Historial de ubicaciones 1 año',
      'Prioridad en red comunitaria',
      'Soporte prioritario 24/7',
      'Recompensas destacadas',
    ],
  },
]
