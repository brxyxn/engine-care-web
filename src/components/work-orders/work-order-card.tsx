"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import { WorkOrderEditSheet } from "@/components/work-orders/work-order-edit-sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatCurrency, initials, serviceTypeLabels } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"

const priorityMeta: Record<
  WorkOrderPriority,
  { label: string; tone: StatusTone }
> = {
  low: { label: "Low", tone: "muted" },
  normal: { label: "Normal", tone: "info" },
  high: { label: "High", tone: "warning" },
  urgent: { label: "Urgent", tone: "destructive" },
}

export type WorkOrderCardProps = {
  workOrder: WorkOrder
  vehicle: Vehicle | null
  customer: Customer | null
  mechanic: StaffMember | null
  staff: StaffMember[]
}

export function WorkOrderCard({
  workOrder,
  vehicle,
  customer,
  mechanic,
  staff,
}: WorkOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: workOrder.id })
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "bg-card border-border/70 flex cursor-grab flex-col gap-2.5 rounded-xl border p-3.5 shadow-sm transition-shadow active:cursor-grabbing",
        isDragging && "z-10 opacity-90 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="data-id text-muted-foreground">
          {workOrder.number}
        </span>
        <div className="flex items-center gap-1">
          <StatusBadge tone={priorityMeta[workOrder.priority].tone}>
            {priorityMeta[workOrder.priority].label}
          </StatusBadge>
          {/* Stop pointer-down so opening the editor never starts a drag */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${workOrder.number}`}
            className="text-muted-foreground hover:text-foreground size-6"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              setEditOpen(true)
            }}
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
      </div>
      <p className="text-sm leading-snug font-medium">{workOrder.title}</p>
      <p className="text-muted-foreground text-xs">
        {vehicle
          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
          : "Vehicle TBD"}
        {" · "}
        {serviceTypeLabels[workOrder.serviceType]}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">
              {mechanic ? initials(mechanic.name) : "—"}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-xs">
            {customer?.name ?? "Unknown"}
          </span>
        </div>
        <span className="text-sm font-semibold">
          {formatCurrency(workOrder.estimateTotal)}
        </span>
      </div>

      <WorkOrderEditSheet
        workOrder={workOrder}
        staff={staff}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
