import { cn } from "@/lib/utils"

export type StatusTone =
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "accent"
  | "muted"

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/12 text-destructive",
  accent: "bg-chart-2/15 text-chart-2",
  muted: "bg-muted text-muted-foreground",
}

export type StatusBadgeProps = {
  tone: StatusTone
  children: React.ReactNode
  className?: string
}

/** Pill-shaped status chip; tone encodes state, text carries the meaning. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
