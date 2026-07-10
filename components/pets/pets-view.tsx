'use client'

import { AlertCircle, PawPrint } from 'lucide-react'
import { usePets } from '@/hooks/use-pets'
import { PetCard } from '@/components/pets/pet-card'
import { AddPetDialog } from '@/components/pets/add-pet-dialog'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PetsView() {
  const { mascotas, cargando, error, recargar } = usePets()

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {cargando
              ? 'Cargando…'
              : `${mascotas.length} ${mascotas.length === 1 ? 'mascota' : 'mascotas'} registradas`}
          </p>
        </div>
        <AddPetDialog onCreado={recargar} />
      </div>

      {cargando && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden p-0">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!cargando && error && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-urgent/30 bg-urgent/10 p-8 text-center">
          <AlertCircle className="size-8 text-urgent" />
          <p className="text-sm text-urgent">{error}</p>
          <Button variant="outline" onClick={recargar}>
            Reintentar
          </Button>
        </div>
      )}

      {!cargando && !error && mascotas.length === 0 && (
        <EmptyState
          icon={PawPrint}
          titulo="Aún no tienes mascotas"
          descripcion="Agrega tu primera mascota y vincula su collar GPS para empezar a rastrearla."
        >
          <AddPetDialog onCreado={recargar} />
        </EmptyState>
      )}

      {!cargando && !error && mascotas.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mascotas.map((m) => (
            <PetCard key={m.id} mascota={m} />
          ))}
        </div>
      )}
    </div>
  )
}
