"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/useRegistro"

type Step = 1 | 2 | 3

interface FormData {
  nombre: string
  appat: string
  apmat: string
  email: string
  password: string
  telefonoPrincipal: string
  telefonoSegundario: string
  nacimiento: string
}

const INITIAL: FormData = {
  nombre: "",
  appat: "",
  apmat: "",
  email: "",
  password: "",
  telefonoPrincipal: "",
  telefonoSegundario: "",
  nacimiento: "",
}

const STEP_LABELS: Record<Step, string> = {
  1: "Datos personales",
  2: "Contacto",
  3: "Confirmar",
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, loading, error, success } = useRegister()
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const validateStep1 = () => {
    const e: Partial<FormData> = {}
    if (!formData.nombre.trim()) e.nombre = "Requerido"
    if (!formData.appat.trim()) e.appat = "Requerido"
    if (!formData.apmat.trim()) e.apmat = "Requerido"
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email inválido"
    if (formData.password.length < 8) e.password = "Mínimo 8 caracteres"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<FormData> = {}
    if (!formData.telefonoPrincipal.trim()) e.telefonoPrincipal = "Requerido"
    if (!formData.nacimiento) e.nacimiento = "Requerido"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => (s + 1) as Step)
  }

  const handleBack = () => setStep((s) => (s - 1) as Step)

  const handleSubmit = async () => {
    await register({
      nombreUsuario: formData.nombre,
      email: formData.email,
      contraseña: formData.password,
      roles: [1],
      perfil: {
        avatar: "https://avatars.githubusercontent.com/u/147568951?s=400",
        nombre: formData.nombre,
        appat: formData.appat,
        apmat: formData.apmat,
        nacimiento: formData.nacimiento,
        contacto: {
          telefonoPrincipal: formData.telefonoPrincipal,
          telefonoSegundario: formData.telefonoSegundario,
          email: formData.email,
        },
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                step === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : step > s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {step > s ? "✓" : s}
            </div>
            <span
              className={cn(
                "text-xs hidden sm:block",
                step >= s ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {STEP_LABELS[s]}
            </span>
            {i < 2 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors",
                  step > s ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
            <Input
              id="nombre"
              type="text"
              placeholder="Juanito"
              value={formData.nombre}
              onChange={handleChange}
              className="bg-background"
            />
            {errors.nombre && (
              <p className="text-xs text-red-500">{errors.nombre}</p>
            )}
          </Field>

          <Field className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="appat" className="mb-2">Apellido paterno</FieldLabel>
              <Input
                id="appat"
                type="text"
                placeholder="López"
                value={formData.appat}
                onChange={handleChange}
                className="bg-background"
              />
              {errors.appat && (
                <p className="text-xs text-red-500">{errors.appat}</p>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="apmat" className="mb-2">Apellido materno</FieldLabel>
              <Input
                id="apmat"
                type="text"
                placeholder="Colón"
                value={formData.apmat}
                onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="bg-background"
            />
            <FieldDescription>Mínimo 8 caracteres.</FieldDescription>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </Field>

          <Field>
            <Button type="button" onClick={handleNext} className="w-full">
              Siguiente
            </Button>
          </Field>
        </FieldGroup>
      )}

      {/* Step 2 */}
      {step === 2 && (
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleChange}
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
              onClick={handleBack}
              className="flex-none"
            >
              Atrás
            </Button>
            <Button type="button" onClick={handleNext} className="flex-1">
              Revisar
            </Button>
          </Field>
        </FieldGroup>
      )}

      {/* Step 3 — resumen */}
      {step === 3 && (
        <FieldGroup>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Datos personales
              </p>
              <Row label="Nombre" value={`${formData.nombre} ${formData.appat} ${formData.apmat}`} />
              <Row label="Email" value={formData.email} />
              <Row label="Contraseña" value="••••••••" />
            </div>
            <div className="border-t pt-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Contacto
              </p>
              <Row label="Tel. principal" value={formData.telefonoPrincipal} />
              {formData.telefonoSegundario && (
                <Row label="Tel. secundario" value={formData.telefonoSegundario} />
              )}
              <Row label="Nacimiento" value={formData.nacimiento} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-500">
              ¡Cuenta creada correctamente!
            </p>
          )}

          <Field className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={loading}
              className="flex-none"
            >
              Atrás
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="px-6 text-center">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Iniciar sesión
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}