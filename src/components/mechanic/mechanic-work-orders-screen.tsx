"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { KanbanBoard } from "@/components/work-orders/kanban-board"
import { NotesCard } from "@/components/work-orders/notes-card"
import {
  useCustomers,
  useStaff,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import { useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"

export function MechanicWorkOrdersScreen() {
  const session = useAppSelector(selectSession)
  const { workOrders } = useWorkOrders()
  const { vehicles } = useVehicles()
  const { customers } = useCustomers()
  const { staff } = useStaff()

  if (!workOrders || !session) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="My Work Orders" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const mine = workOrders.filter(
    (wo) => wo.assignedMechanicId === session.user.id
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Work Orders"
        description="Drag a card as the job moves forward"
      />
      <KanbanBoard
        workOrders={mine}
        vehicles={vehicles ?? []}
        customers={customers ?? []}
        staff={staff ?? []}
      />
      <div className="max-w-xl">
        <NotesCard workOrders={mine} staff={staff ?? []} />
      </div>
    </div>
  )
}
