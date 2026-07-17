"use client"

import { format } from "date-fns"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { KanbanBoard } from "@/components/work-orders/kanban-board"
import {
  useAppointments,
  useCustomers,
  useStaff,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import { formatCompactCurrency } from "@/lib/format"
import { useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { Bell, CircleCheck, ClipboardList, Gauge, History, Wrench } from "lucide-react"

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
    (wo) => wo.assignedMechanicId === session.user.id
  )
  const openCount = mine.filter((wo) => wo.status !== "delivered").length
  const myOrderIds = new Set(mine.map((wo) => wo.id))
  const myAppointments = (appointments ?? []).filter(
    (a) => a.workOrderId !== null && myOrderIds.has(a.workOrderId)
  )

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
          value={String(openCount)}
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

      <KanbanBoard
        workOrders={mine}
        vehicles={vehicles ?? []}
        customers={customers ?? []}
        staff={staff ?? []}
      />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {/* Notifications lands in a later phase — placeholder holds the slot. */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
              <Bell className="size-6" />
              Alerts and reminders land here soon.
            </div>
          </CardContent>
        </Card>

        <UpcomingAppointments
          appointments={myAppointments}
          customers={customers ?? []}
          vehicles={vehicles ?? []}
          limit={6}
        />
      </div>

      {/* Recent Activity is planned for the next phase. */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
            <History className="size-6" />
            Your recent activity timeline is coming soon.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
