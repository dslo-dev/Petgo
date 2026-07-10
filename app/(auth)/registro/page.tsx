import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        Crea tu cuenta
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Empieza a proteger a tus mascotas en minutos.
      </p>
      <AuthForm modo="registro" />
    </div>
  )
}
