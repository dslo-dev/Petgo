import { Brand } from '@/components/brand'
import { MapPin, ShieldCheck, Users } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Panel de marca / imagen representativa */}
      <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:w-1/2 lg:flex-col lg:justify-between"
        style={{ backgroundImage: 'url(/imagen-Representativa-login.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative">
          <Brand />
        </div>
        <div className="relative max-w-md">
          <h1 className="font-serif text-4xl font-semibold leading-tight text-balance">
            Cada mascota, siempre en el mapa.
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-pretty">
            Rastreo GPS en tiempo real, zonas seguras y una comunidad que ayuda
            a encontrar mascotas perdidas cerca de ti.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin className="size-4" /> Ubicación precisa del collar
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4" /> Alertas de zona segura
            </li>
            <li className="flex items-center gap-3">
              <Users className="size-4" /> Grupo familiar compartido
            </li>
          </ul>
        </div>
        <p className="relative font-mono text-xs text-primary-foreground/60">
          SYS · 33.4489°S 70.6693°O
        </p>
      </section>

      {/* Panel del formulario */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}
