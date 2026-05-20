import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SignupFormData } from "../types"

interface Props {
  formData: SignupFormData
  errors: Partial<SignupFormData>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNext: () => void
}

export function Step1Personal({ formData, errors, onChange, onNext }: Props) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
        <Input
          id="nombre"
          type="text"
          placeholder="Juanito"
          value={formData.nombre}
          onChange={onChange}
          className="bg-background"
        />
        {errors.nombre && (
          <p className="text-xs text-red-500">{errors.nombre}</p>
        )}
      </Field>

      <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="appat" className="mb-2">
            Apellido paterno
          </FieldLabel>
          <Input
            id="appat"
            type="text"
            placeholder="López"
            value={formData.appat}
            onChange={onChange}
            className="bg-background"
          />
          {errors.appat && (
            <p className="text-xs text-red-500">{errors.appat}</p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="apmat" className="mb-2">
            Apellido materno
          </FieldLabel>
          <Input
            id="apmat"
            type="text"
            placeholder="Colón"
            value={formData.apmat}
            onChange={onChange}
            className="bg-background"
          />
          {errors.apmat && (
            <p className="text-xs text-red-500">{errors.apmat}</p>
          )}
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={onChange}
          className="bg-background"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={onChange}
          className="bg-background"
        />
        <FieldDescription>Mínimo 8 caracteres.</FieldDescription>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </Field>

      <Field>
        <Button type="button" onClick={onNext} className="w-full">
          Siguiente
        </Button>
      </Field>
    </FieldGroup>
  )
}