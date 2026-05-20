export interface SignupFormData {
  nombre: string
  appat: string
  apmat: string
  email: string
  password: string
  telefonoPrincipal: string
  telefonoSegundario: string
  nacimiento: string
}

export type Step = 1 | 2 | 3

export const STEP_LABELS: Record<Step, string> = {
  1: "Datos personales",
  2: "Contacto",
  3: "Confirmar",
}

export const INITIAL_FORM: SignupFormData = {
  nombre: "",
  appat: "",
  apmat: "",
  email: "",
  password: "",
  telefonoPrincipal: "",
  telefonoSegundario: "",
  nacimiento: "",
}