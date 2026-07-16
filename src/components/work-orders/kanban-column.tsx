"use client"

import { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { formatCompactCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

const columnDots: Record<string, string> = {
  intake: "bg-muted-foreground",
  diagnostics: "bg-info",
  in_repair: "bg-chart-2",
  waiting_parts: "bg-warning",
  ready: "bg-success",
}

export type KanbanColumnProps = {
  status: WorkOrderStatus
  label: string
  count: number
  total: number
  children: ReactNode
}

export function KanbanColumn({
  status,
  label,
  count,
  total,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <span className={cn("size-2 rounded-full", columnDots[status])} />
        <span className="text-sm font-medium">{label}</span>
        <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs tabular-nums">
          {count}
        </span>
        <span className="text-muted-foreground ml-auto text-xs">
          {formatCompactCurrency(total)}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "bg-muted/30 flex min-h-40 flex-1 flex-col gap-3 rounded-xl p-2 transition-colors",
          isOver && "bg-primary/8 ring-primary/40 ring-2"
        )}
      >
        {children}
      </div>
    </div>
  )
}
