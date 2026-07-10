'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'
import { useSession } from '@/components/session-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ modo }: { modo: 'login' | 'registro' }) {
  const router = useRouter()
  const { login, registro } = useSession()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      if (modo === 'login') {
        await login(email, password)
      } else {
        await registro(nombre, email, password)
      }
      router.push('/mascotas')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocurrió un error. Intenta de nuevo.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-urgent/30 bg-urgent/10 px-3 py-2 text-sm text-urgent"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {modo === 'registro' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
          required
        />
      </div>

      <Button type="submit" className="mt-1 w-full" disabled={cargando}>
        {cargando && <Loader2 className="size-4 animate-spin" />}
        {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {modo === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <Link
              href="/registro"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Regístrate
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
