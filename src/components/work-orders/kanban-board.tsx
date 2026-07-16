"use client"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { KanbanColumn } from "@/components/work-orders/kanban-column"
import { WorkOrderCard } from "@/components/work-orders/work-order-card"
import { workOrderStatusLabels } from "@/lib/format"
import { useAppDispatch } from "@/redux/hooks"
import { moveWorkOrder } from "@/redux/work-orders/work-orders-slice"
import { updateWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { toast } from "sonner"

const boardColumns: WorkOrderStatus[] = [
  "intake",
  "diagnostics",
  "in_repair",
  "waiting_parts",
  "ready",
]

export type KanbanBoardProps = {
  workOrders: WorkOrder[]
  vehicles: Vehicle[]
  customers: Customer[]
  staff: StaffMember[]
}

export function KanbanBoard({
  workOrders,
  vehicles,
  customers,
  staff,
}: KanbanBoardProps) {
  const dispatch = useAppDispatch()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))
  const customerById = new Map(customers.map((c) => [c.id, c]))
  const staffById = new Map(staff.map((s) => [s.id, s]))

  const onDragEnd = (event: DragEndEvent) => {
    const workOrderId = String(event.active.id)
    const nextStatus = event.over?.id as WorkOrderStatus | undefined
    if (!nextStatus || !boardColumns.includes(nextStatus)) return

    const workOrder = workOrders.find((wo) => wo.id === workOrderId)
    if (!workOrder || workOrder.status === nextStatus) return

    // Optimistic move; PATCH confirms (mock echoes the change)
    dispatch(moveWorkOrder({ id: workOrderId, status: nextStatus }))
    dispatch(
      updateWorkOrder({ id: workOrderId, patch: { status: nextStatus } })
    )
    toast.success(
      `${workOrder.number} moved to ${workOrderStatusLabels[nextStatus]}`
    )
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {boardColumns.map((status) => {
          const columnOrders = workOrders.filter(
            (wo) => wo.status === status
          )
          const total = columnOrders.reduce(
            (sum, wo) => sum + wo.estimateTotal,
            0
          )
          return (
            <KanbanColumn
              key={status}
              status={status}
              label={workOrderStatusLabels[status]}
              count={columnOrders.length}
              total={total}
            >
              {columnOrders.map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  vehicle={vehicleById.get(workOrder.vehicleId) ?? null}
                  customer={customerById.get(workOrder.customerId) ?? null}
                  mechanic={
                    workOrder.assignedMechanicId
                      ? (staffById.get(workOrder.assignedMechanicId) ?? null)
                      : null
                  }
                />
              ))}
              {columnOrders.length === 0 && (
                <p className="text-muted-foreground/70 py-6 text-center text-xs">
                  Drag a work order here
                </p>
              )}
            </KanbanColumn>
          )
        })}
      </div>
    </DndContext>
  )
}
