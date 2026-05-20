import { cn } from "@/lib/utils"
import { type Step, STEP_LABELS } from "../types"

interface Props {
  currentStep: Step
}

export function StepperBar({ currentStep }: Props) {
  const steps = [1, 2, 3] as Step[]

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
              currentStep === s && "border-primary bg-primary text-primary-foreground",
              currentStep > s  && "border-primary bg-primary/10 text-primary",
              currentStep < s  && "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {currentStep > s ? "✓" : s}
          </div>
          <span
            className={cn(
              "text-xs hidden sm:block",
              currentStep >= s ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {STEP_LABELS[s]}
          </span>
          {i < 2 && (
            <div
              className={cn(
                "h-px flex-1 transition-colors",
                currentStep > s ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}