"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateWorkOrderDialog } from "@/components/work-orders/create-work-order-dialog"
import { DocumentsCard } from "@/components/work-orders/documents-card"
import { InvoicesList } from "@/components/work-orders/invoices-list"
import { KanbanBoard } from "@/components/work-orders/kanban-board"
import { MechanicPerformance } from "@/components/work-orders/mechanic-performance"
import { NotesCard } from "@/components/work-orders/notes-card"
import { RevenueAnalytics } from "@/components/work-orders/revenue-analytics"
import {
  useCustomers,
  useDashboard,
  useInvoices,
  useStaff,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import { formatCompactCurrency } from "@/lib/format"
import {
  CircleCheck,
  ClipboardList,
  Clock,
  Plus,
  Timer,
} from "lucide-react"

const DAY = 24 * 60 * 60 * 1000

export function WorkOrdersScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { workOrders } = useWorkOrders()
  const { vehicles } = useVehicles()
  const { customers } = useCustomers()
  const { staff } = useStaff()
  const { invoices } = useInvoices()
  const { stats } = useDashboard()

  const [createOpen, setCreateOpen] = useState(
    searchParams.get("new") === "1"
  )
  // Reference time captured once per mount; keeps render pure
  const [now] = useState(() => Date.now())

  const closeCreate = (open: boolean) => {
    setCreateOpen(open)
    if (!open && searchParams.get("new") === "1") {
      router.replace("/work-orders")
    }
  }

  if (!workOrders) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Work Orders" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const open = workOrders.filter((wo) => wo.status !== "delivered")
  const openValue = open.reduce((sum, wo) => sum + wo.estimateTotal, 0)
  const completed = workOrders.filter((wo) => wo.status === "delivered")
  const completedThisWeek = completed.filter(
    (wo) =>
      wo.completedAt !== null &&
      now - new Date(wo.completedAt).getTime() < 7 * DAY
  ).length

  const overdue = open.filter(
    (wo) =>
      wo.scheduledAt !== null &&
      new Date(wo.scheduledAt).getTime() < now - DAY
  ).length
  const onTimePct =
    open.length > 0 ? Math.round(((open.length - overdue) / open.length) * 100) : 100

  const turnarounds = completed
    .filter((wo) => wo.completedAt !== null)
    .map(
      (wo) =>
        (new Date(wo.completedAt!).getTime() -
          new Date(wo.createdAt).getTime()) /
        DAY
    )
  const avgTurnaround =
    turnarounds.length > 0
      ? turnarounds.reduce((sum, days) => sum + days, 0) / turnarounds.length
      : 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Work Orders"
        description="Pipeline from intake to delivery"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            New work order
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<ClipboardList />}
          label="Open Pipeline"
          value={formatCompactCurrency(openValue)}
          badge={`${open.length} orders`}
        />
        <KpiCard
          icon={<CircleCheck />}
          label="Completed"
          value={String(completedThisWeek)}
          badge="this week"
          badgeTone="positive"
        />
        <KpiCard
          icon={<Clock />}
          label="On-Time Rate"
          value={`${onTimePct}%`}
          badge={overdue > 0 ? `${overdue} running late` : "all on schedule"}
          badgeTone={overdue > 0 ? "negative" : "positive"}
        />
        <KpiCard
          icon={<Timer />}
          label="Avg Turnaround"
          value={`${avgTurnaround.toFixed(1)}d`}
          badge="creation to delivery"
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <KanbanBoard
            workOrders={workOrders}
            vehicles={vehicles ?? []}
            customers={customers ?? []}
            staff={staff ?? []}
          />
        </div>
        <div className="flex flex-col gap-4">
          <MechanicPerformance staff={staff ?? []} />
          {stats && <RevenueAnalytics data={stats.revenueTrend} />}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InvoicesList invoices={invoices ?? []} />
        <NotesCard workOrders={workOrders} staff={staff ?? []} />
        <DocumentsCard />
      </div>

      <CreateWorkOrderDialog
        open={createOpen}
        onOpenChange={closeCreate}
        customers={customers ?? []}
        vehicles={vehicles ?? []}
      />
    </div>
  )
}
