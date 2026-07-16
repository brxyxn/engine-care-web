import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCompactCurrency, initials } from "@/lib/format"

export type MechanicPerformanceProps = {
  staff: StaffMember[]
}

export function MechanicPerformance({ staff }: MechanicPerformanceProps) {
  const mechanics = staff
    .filter((member) => member.role === "mechanic")
    .sort((a, b) => b.revenueMtd - a.revenueMtd)
  const top = mechanics[0]?.revenueMtd ?? 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mechanic Performance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {mechanics.map((mechanic) => (
          <div key={mechanic.id} className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                {initials(mechanic.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{mechanic.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatCompactCurrency(mechanic.revenueMtd)} MTD
                </span>
              </div>
              <Progress
                value={(mechanic.revenueMtd / top) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
