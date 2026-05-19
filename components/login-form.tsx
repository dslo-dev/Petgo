import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Inicia Sesion</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Completa los campos para ingresar a la plataforma
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Correo Electronico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="*******"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">Iniciar Sesion</Button>
        </Field>

        <FieldDescription className="text-center">
          ¿Aún no tienes cuenta?  
          <a href="/registro" className="underline underline-offset-4 ml-3">
            Crear cuenta
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
