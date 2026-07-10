'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from '@/components/brand'
import { navItems } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link href="/mascotas">
          <Brand />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const activo =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activo
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Red activa · señal ok
        </p>
      </div>
    </aside>
  )
}
