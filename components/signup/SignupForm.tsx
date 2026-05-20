"use client"

import { cn } from "@/lib/utils"
import { useSignupForm } from "./useSignupForm"
import { StepperBar } from "./components/StepperBar"
import { Step1Personal } from "./steps/Step1Personal"
import { Step2Contacto } from "./steps/Step2Contacto"
import { Step3Confirmar } from "./steps/Step3Confirmar"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const form = useSignupForm()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <StepperBar currentStep={form.step} />

      {form.step === 1 && (
        <Step1Personal
          formData={form.formData}
          errors={form.errors}
          onChange={form.handleChange}
          onNext={form.nextStep}
        />
      )}
      {form.step === 2 && (
        <Step2Contacto
          formData={form.formData}
          errors={form.errors}
          onChange={form.handleChange}
          onNext={form.nextStep}
          onBack={form.prevStep}
        />
      )}
      {form.step === 3 && (
        <Step3Confirmar
          formData={form.formData}
          loading={form.loading}
          error={form.error}
          success={form.success}
          onSubmit={form.handleSubmit}
          onBack={form.prevStep}
        />
      )}
    </div>
  )
}