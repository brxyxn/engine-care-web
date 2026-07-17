"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { WorkOrderNotesBoard } from "@/components/work-orders/work-order-notes-board"
import { useStaff, useWorkOrders } from "@/hooks/use-data"
import { useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"

export function MechanicWorkOrdersScreen() {
  const session = useAppSelector(selectSession)
  const { workOrders } = useWorkOrders()
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
        description="Notes and findings per active job"
      />
      <WorkOrderNotesBoard workOrders={mine} staff={staff ?? []} />
    </div>
  )
}
