'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, ChevronDown } from 'lucide-react'
import { useSession } from '@/components/session-provider'
import { mockUsuario } from '@/lib/mock-data'
import { Brand } from '@/components/brand'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Topbar({ titulo }: { titulo?: string }) {
  const router = useRouter()
  const { usuario, logout } = useSession()

  const iniciales =
    usuario?.nombre
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?'

  function onLogout() {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Brand compact />
        </div>
        {titulo && (
          <h1 className="font-serif text-lg font-semibold text-foreground lg:text-xl">
            {titulo}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Link
          href="/alertas"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Alertas"
        >
          <Bell className="size-5" />
        </Link>

        <div className="flex items-center gap-0.5">
          <Link
            href="/perfil"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ir al perfil"
          >
            <Avatar className="size-9 border border-border">
              <AvatarImage src={mockUsuario.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {iniciales}
              </AvatarFallback>
            </Avatar>
          </Link>
          <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Opciones"
              />
            }
          >
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate font-medium">{usuario?.nombre}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {usuario?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onLogout} variant="destructive">
                <LogOut className="size-4" /> Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
