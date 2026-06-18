interface Props {
  label: string
  value: string
}

export function ReviewRow({ label, value }: Props) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}