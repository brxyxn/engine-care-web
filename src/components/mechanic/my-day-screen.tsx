"use client"

import { format } from "date-fns"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAppointments,
  useCustomers,
  useStaff,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import {
  formatCompactCurrency,
  serviceTypeLabels,
  workOrderStatusLabels,
} from "@/lib/format"
import { useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { CircleCheck, ClipboardList, Gauge, Wrench } from "lucide-react"

const statusTones: Record<WorkOrderStatus, StatusTone> = {
  intake: "muted",
  diagnostics: "info",
  in_repair: "accent",
  waiting_parts: "warning",
  ready: "success",
  delivered: "muted",
}

export function MyDayScreen() {
  const session = useAppSelector(selectSession)
  const { workOrders } = useWorkOrders()
  const { appointments } = useAppointments()
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { staff } = useStaff()

  const me = (staff ?? []).find((s) => s.id === session?.user.id)

  if (!workOrders || !session) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="My Day" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const mine = workOrders.filter(
    (wo) =>
      wo.assignedMechanicId === session.user.id && wo.status !== "delivered"
  )
  const myOrderIds = new Set(mine.map((wo) => wo.id))
  const myAppointments = (appointments ?? []).filter(
    (a) => a.workOrderId !== null && myOrderIds.has(a.workOrderId)
  )
  const vehicleById = new Map((vehicles ?? []).map((v) => [v.id, v]))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Day"
        description={format(new Date(), "EEEE, MMMM d")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<ClipboardList />}
          label="My Open Orders"
          value={String(mine.length)}
        />
        <KpiCard
          icon={<Gauge />}
          label="Workload"
          value={me ? `${me.activeTasks}/${me.capacity}` : "—"}
          badge="active vs capacity"
        />
        <KpiCard
          icon={<CircleCheck />}
          label="Completed"
          value={String(me?.completedMtd ?? 0)}
          badge="this month"
          badgeTone="positive"
        />
        <KpiCard
          icon={<Wrench />}
          label="Revenue"
          value={formatCompactCurrency(me?.revenueMtd ?? 0)}
          badge="this month"
          badgeTone="positive"
        />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Active Work Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mine.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                Nothing assigned — check the pipeline for unclaimed orders.
              </p>
            )}
            {mine.map((order) => {
              const vehicle = vehicleById.get(order.vehicleId)
              return (
                <div
                  key={order.id}
                  className="bg-muted/40 flex flex-col gap-2 rounded-xl p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="data-id text-muted-foreground">
                      {order.number}
                    </span>
                    <StatusBadge tone={statusTones[order.status]}>
                      {workOrderStatusLabels[order.status]}
                    </StatusBadge>
                  </div>
                  <p className="text-sm font-medium">{order.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {vehicle
                      ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                      : "Vehicle TBD"}
                    {" · "}
                    {serviceTypeLabels[order.serviceType]}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={order.progressPct} className="h-1.5" />
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {order.progressPct}%
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <UpcomingAppointments
          appointments={myAppointments}
          customers={customers ?? []}
          vehicles={vehicles ?? []}
          limit={6}
        />
      </div>
    </div>
  )
}
