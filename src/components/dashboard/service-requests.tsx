import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { serviceTypeLabels } from "@/lib/format"

export type ServiceRequestsProps = {
  data: DashboardStats["serviceRequests"]
}

/** Share of open work orders by service type. */
export function ServiceRequests({ data }: ServiceRequestsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {data.map((row) => (
          <div key={row.serviceType} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span>{serviceTypeLabels[row.serviceType]}</span>
              <span className="text-muted-foreground">{row.pct}%</span>
            </div>
            <Progress value={row.pct} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
