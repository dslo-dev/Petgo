import { useState } from "react"
import { useRegister } from "@/hooks/useRegistro"
import { INITIAL_FORM, type SignupFormData, type Step } from "./types"

export function useSignupForm() {
  const { register, loading, error, success } = useRegister()
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  const validateStep1 = () => {
    const e: Partial<SignupFormData> = {}
    if (!formData.nombre.trim())                    e.nombre   = "Requerido"
    if (!formData.appat.trim())                     e.appat    = "Requerido"
    if (!formData.apmat.trim())                     e.apmat    = "Requerido"
    if (!/\S+@\S+\.\S+/.test(formData.email))       e.email    = "Email inválido"
    if (formData.password.length < 8)               e.password = "Mínimo 8 caracteres"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<SignupFormData> = {}
    if (!formData.telefonoPrincipal.trim()) e.telefonoPrincipal = "Requerido"
    if (!formData.nacimiento)              e.nacimiento        = "Requerido"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => (s + 1) as Step)
  }

  const prevStep = () => setStep((s) => (s - 1) as Step)

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

  return {
    step,
    formData,
    errors,
    loading,
    error,
    success,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
  }
}