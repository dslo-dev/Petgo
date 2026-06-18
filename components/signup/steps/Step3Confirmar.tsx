import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { ReviewRow } from "../components/ReviewRow"
import type { SignupFormData } from "../types"

interface Props {
  formData: SignupFormData
  loading: boolean
  error: string | null
  success: boolean
  onSubmit: () => void
  onBack: () => void
}

export function Step3Confirmar({
  formData,
  loading,
  error,
  success,
  onSubmit,
  onBack,
}: Props) {
  return (
    <FieldGroup>
      <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Datos personales
          </p>
          <ReviewRow
            label="Nombre completo"
            value={`${formData.nombre} ${formData.appat} ${formData.apmat}`}
          />
          <ReviewRow label="Email" value={formData.email} />
          <ReviewRow label="Contraseña" value="••••••••" />
        </div>

        <div className="border-t pt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Contacto
          </p>
          <ReviewRow label="Tel. principal" value={formData.telefonoPrincipal} />
          {formData.telefonoSegundario && (
            <ReviewRow label="Tel. secundario" value={formData.telefonoSegundario} />
          )}
          <ReviewRow label="Nacimiento" value={formData.nacimiento} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-500">¡Cuenta creada correctamente!</p>
      )}

      <Field className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-none"
        >
          Atrás
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={loading || success}
          className="flex-1"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </Field>
    </FieldGroup>
  )
}