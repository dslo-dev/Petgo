import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Mascota } from '@/lib/types'
import { MetricBar } from '@/components/metric-bar'
import { Card } from '@/components/ui/card'

const especieLabel: Record<Mascota['especie'], string> = {
  perro: 'Perro',
  gato: 'Gato',
  otro: 'Otro',
}

export function PetCard({ mascota }: { mascota: Mascota }) {
  return (
    <Card className="group overflow-hidden p-0 transition-shadow hover:shadow-md">
      <Link href={`/mascotas/${mascota.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mascota.fotoUrl || '/placeholder.svg?height=200&width=320&query=pet'}
            alt={`Foto de ${mascota.nombre}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {mascota.nombre}
              </h3>
              <p className="text-sm text-muted-foreground">
                {especieLabel[mascota.especie]} · {mascota.raza}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            <MetricBar tipo="bateria" valor={mascota.bateria} />
            <MetricBar tipo="senal" valor={mascota.senal} />
          </div>

          {mascota.collarId && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Collar {mascota.collarId}
            </p>
          )}
        </div>
      </Link>
    </Card>
  )
}
