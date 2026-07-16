import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type KpiTone = "positive" | "negative" | "neutral"

export type KpiCardProps = {
  icon: ReactNode
  label: string
  value: string
  badge?: string
  badgeTone?: KpiTone
}

const toneClasses: Record<KpiTone, string> = {
  positive: "bg-success/12 text-success",
  negative: "bg-destructive/12 text-destructive",
  neutral: "bg-muted text-muted-foreground",
}

export function KpiCard({
  icon,
  label,
  value,
  badge,
  badgeTone = "neutral",
}: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <span className="bg-primary/12 text-primary flex size-10 items-center justify-center rounded-xl [&_svg]:size-5">
          {icon}
        </span>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          {badge && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                toneClasses[badgeTone]
              )}
            >
              {badge}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
