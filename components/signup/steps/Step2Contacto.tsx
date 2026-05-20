import { Button } from "@/components/ui/button"
import {
  Field,
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
  onBack: () => void
}

export function Step2Contacto({ formData, errors, onChange, onNext, onBack }: Props) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Email (confirmado)</FieldLabel>
        <Input
          value={formData.email}
          disabled
          className="bg-muted text-muted-foreground"
        />
      </Field>

      <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="telefonoPrincipal" className="mb-2">
            Teléfono principal
          </FieldLabel>
          <Input
            id="telefonoPrincipal"
            type="tel"
            placeholder="+56912345678"
            value={formData.telefonoPrincipal}
            onChange={onChange}
            className="bg-background"
          />
          {errors.telefonoPrincipal && (
            <p className="text-xs text-red-500">{errors.telefonoPrincipal}</p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="telefonoSegundario" className="mb-2">
            Teléfono secundario
          </FieldLabel>
          <Input
            id="telefonoSegundario"
            type="tel"
            placeholder="+56987654321"
            value={formData.telefonoSegundario}
            onChange={onChange}
            className="bg-background"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="nacimiento">Fecha de nacimiento</FieldLabel>
        <Input
          id="nacimiento"
          type="date"
          value={formData.nacimiento}
          onChange={onChange}
          className="bg-background"
        />
        {errors.nacimiento && (
          <p className="text-xs text-red-500">{errors.nacimiento}</p>
        )}
      </Field>

      <Field className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-none"
        >
          Atrás
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Revisar
        </Button>
      </Field>
    </FieldGroup>
  )
}