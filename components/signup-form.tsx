import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea tu propia cuenta</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input
            id="password"
            placeholder="*******"
            type="password"
            required
            className="bg-background"
          />
          <FieldDescription>
            Contraseña debe tener al menos 8 caracteres.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" >Crear ahora</Button>
        </Field>
        <Field>

          <FieldDescription className="px-6 text-center">
            ¿Ya tienes una cuenta? <a href="/login">Inicar Sesion</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
