import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        Bienvenido de vuelta
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Ingresa para ver dónde están tus mascotas.
      </p>
      <AuthForm modo="login" />
    </div>
  )
}
