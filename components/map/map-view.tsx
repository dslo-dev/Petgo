'use client'

import { Map, MapPinned, Cctv, Route } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MapaSection } from './mapa-section'
import { ZonasList } from './zonas-list'
import { DispositivosList } from './dispositivos-list'
import { RecorridosList } from './recorridos-list'

export function MapView() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Mapa
        </h1>
        <p className="text-sm text-muted-foreground">
          Zonas de seguridad, dispositivos GPS y recorridos de tus mascotas.
        </p>
      </div>

      <Tabs defaultValue="mapa" className="w-full">
        <TabsList>
          <TabsTrigger value="mapa">
            <MapPinned className="size-4" /> Mapa
          </TabsTrigger>
          <TabsTrigger value="zonas">
            <Map className="size-4" /> Zonas seguras
          </TabsTrigger>
          <TabsTrigger value="dispositivos">
            <Cctv className="size-4" /> Dispositivos GPS
          </TabsTrigger>
          <TabsTrigger value="recorridos">
            <Route className="size-4" /> Recorridos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mapa" className="mt-4">
          <MapaSection />
        </TabsContent>

        <TabsContent value="zonas" className="mt-4">
          <ZonasList />
        </TabsContent>

        <TabsContent value="dispositivos" className="mt-4">
          <DispositivosList />
        </TabsContent>

        <TabsContent value="recorridos" className="mt-4">
          <RecorridosList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
