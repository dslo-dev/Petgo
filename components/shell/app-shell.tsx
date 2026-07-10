'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@/components/session-provider'
import { SidebarNav } from './sidebar-nav'
import { BottomNav } from './bottom-nav'
import { Topbar } from './topbar'
import { navItems } from '@/lib/nav'

function tituloDesdeRuta(pathname: string): string | undefined {
  if (pathname.startsWith('/mascotas/')) return undefined
  const item = navItems.find(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  )
  return item?.label
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { usuario, cargando } = useSession()

  useEffect(() => {
    if (!cargando && !usuario) router.replace('/login')
  }, [cargando, usuario, router])

  if (cargando) return null

  if (!usuario) return null

  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar titulo={tituloDesdeRuta(pathname)} />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
