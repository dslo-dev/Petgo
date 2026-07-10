'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Clock, Ruler, Navigation } from 'lucide-react'
import type { Recorrido } from '@/lib/types'

interface LeafletMapRecorridoProps {
  recorrido: Recorrido
}

async function fetchRutaEnCalles(puntos: Recorrido['puntos']): Promise<[number, number][] | null> {
  if (puntos.length < 2) return null
  const coordsStr = puntos.map((p) => `${p.lng},${p.lat}`).join(';')
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch(
      `https://router.project-osrm.org/match/v1/driving/${coordsStr}?geometries=geojson&overview=full`,
      { signal: ctrl.signal },
    )
    clearTimeout(timer)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.matchings?.[0]?.geometry?.coordinates) return null
    return data.matchings[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
    )
  } catch {
    clearTimeout(timer)
    return null
  }
}

export function LeafletMapRecorrido({ recorrido }: LeafletMapRecorridoProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const { puntos } = recorrido

  useEffect(() => {
    if (!mapRef.current) return

    // Si ya existe un mapa, lo limpia primero (cambio de ruta)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    const coords: [number, number][] = puntos.map((p) => [p.lat, p.lng])
    const rutaLayer = L.layerGroup().addTo(map)
    let activo = true

    function dibujarRuta(pts: [number, number][]) {
      rutaLayer.clearLayers()
      L.polyline(pts, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.8,
      }).addTo(rutaLayer)

      L.circleMarker(pts[0], {
        radius: 7,
        fillColor: '#22c55e',
        color: '#fff',
        weight: 2,
        fillOpacity: 1,
      }).addTo(rutaLayer).bindTooltip('Inicio')

      L.circleMarker(pts[pts.length - 1], {
        radius: 7,
        fillColor: '#ef4444',
        color: '#fff',
        weight: 2,
        fillOpacity: 1,
      }).addTo(rutaLayer).bindTooltip('Fin')

      map.fitBounds(pts, { padding: [50, 50] })
    }

    if (coords.length > 0) {
      dibujarRuta(coords)

      fetchRutaEnCalles(puntos).then((snapped) => {
        if (!activo) return
        if (snapped) dibujarRuta(snapped)
      })
    }

    mapInstanceRef.current = map
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      activo = false
      map.remove()
      mapInstanceRef.current = null
    }
  }, [puntos])

  if (puntos.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border text-sm text-muted-foreground">
        Sin datos de recorrido
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div ref={mapRef} className="h-[400px] sm:h-[500px] w-full" />

      <div className="absolute left-3 top-3 z-[1000] flex flex-wrap gap-2">
        <span className="rounded border border-border/60 bg-card/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          {recorrido.mascotaNombre}
        </span>
        <span className="rounded border border-border/60 bg-card/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          {new Date(recorrido.fecha).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-card/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
          <Ruler className="size-3" /> {recorrido.distanciaKm.toFixed(2)} km
        </span>
        <span className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-card/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
          <Clock className="size-3" /> {recorrido.duracionMin} min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-card/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
          <Navigation className="size-3" /> {recorrido.puntos.length} puntos
        </span>
      </div>
    </div>
  )
}
