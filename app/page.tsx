'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Radar } from 'lucide-react'
import { useSession } from '@/components/session-provider'

export default function HomePage() {
  const router = useRouter()
  const { usuario, cargando } = useSession()

  useEffect(() => {
    if (cargando) return
    router.replace(usuario ? '/mascotas' : '/login')
  }, [usuario, cargando, router])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <span className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        <Radar className="size-4 animate-spin" />
        Cargando…
      </span>
    </div>
  )
}
