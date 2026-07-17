import { NextRequest, NextResponse } from "next/server"
import { store } from "@/app/api/_mock/store"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const workOrder = store.workOrders.find((wo) => wo.id === id)
  if (!workOrder) {
    return NextResponse.json(
      { success: false, error: "Work order not found" },
      { status: 404 }
    )
  }
  return NextResponse.json({ success: true, data: workOrder })
}

/** Status moves (kanban drag), assignee changes, line-item edits, note appends. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const workOrder = store.workOrders.find((wo) => wo.id === id)
  if (!workOrder) {
    return NextResponse.json(
      { success: false, error: "Work order not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<WorkOrder>

  // Derived rules the backend is expected to enforce
  if (patch.status === "ready") {
    patch.progressPct = 100
  }
  if (patch.status === "delivered" && !workOrder.completedAt) {
    patch.completedAt = new Date().toISOString()
  }
  if (patch.lineItems) {
    patch.estimateTotal = patch.lineItems.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    )
  }

  Object.assign(workOrder, patch, { id: workOrder.id })
  return NextResponse.json({ success: true, data: workOrder })
}
