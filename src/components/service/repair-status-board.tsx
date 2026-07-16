import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export type RepairStatusBoardProps = {
  workOrders: WorkOrder[]
  vehicles: Vehicle[]
}

function StatusGroup({
  title,
  orders,
  vehicleById,
}: {
  title: string
  orders: WorkOrder[]
  vehicleById: Map<string, Vehicle>
}) {
  return (
    <div className="bg-muted/30 flex flex-1 flex-col gap-3 rounded-xl p-4">
      <p className="text-sm font-medium">
        {title}{" "}
        <span className="text-muted-foreground">({orders.length})</span>
      </p>
      {orders.length === 0 && (
        <p className="text-muted-foreground/70 py-4 text-center text-xs">
          Nothing in this stage
        </p>
      )}
      {orders.map((order) => {
        const vehicle = vehicleById.get(order.vehicleId)
        return (
          <div key={order.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm">
                {vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle TBD"}
              </span>
              <span className="data-id text-chart-2">{order.number}</span>
            </div>
            <Progress value={order.progressPct} className="h-1.5" />
          </div>
        )
      })}
    </div>
  )
}

export function RepairStatusBoard({
  workOrders,
  vehicles,
}: RepairStatusBoardProps) {
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))
  const diagnostics = workOrders.filter((wo) => wo.status === "diagnostics")
  const inRepair = workOrders.filter(
    (wo) => wo.status === "in_repair" || wo.status === "waiting_parts"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repair Status Board</CardTitle>
        <CardAction>
          <Link
            href="/work-orders"
            className="text-primary text-sm hover:underline"
          >
            Manage workflow
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <StatusGroup
          title="Diagnostics"
          orders={diagnostics}
          vehicleById={vehicleById}
        />
        <StatusGroup
          title="In Repair"
          orders={inRepair}
          vehicleById={vehicleById}
        />
      </CardContent>
    </Card>
  )
}
