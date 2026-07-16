import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { initials } from "@/lib/format"

export type MechanicWorkloadProps = {
  staff: StaffMember[]
}

export function MechanicWorkload({ staff }: MechanicWorkloadProps) {
  const mechanics = staff.filter((member) => member.role === "mechanic")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mechanic Workload</CardTitle>
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
                <span className="text-muted-foreground text-xs tabular-nums">
                  {mechanic.activeTasks}/{mechanic.capacity} tasks
                </span>
              </div>
              <Progress
                value={(mechanic.activeTasks / mechanic.capacity) * 100}
                className="h-1.5"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
