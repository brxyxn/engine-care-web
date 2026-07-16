import { NextRequest, NextResponse } from "next/server"
import { workOrders } from "@/app/api/_mock/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const workOrder = workOrders.find((wo) => wo.id === id)
  if (!workOrder) {
    return NextResponse.json(
      { success: false, error: "Work order not found" },
      { status: 404 }
    )
  }
  return NextResponse.json({ success: true, data: workOrder })
}

/** Status moves (kanban drag), assignee changes, note additions. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const workOrder = workOrders.find((wo) => wo.id === id)
  if (!workOrder) {
    return NextResponse.json(
      { success: false, error: "Work order not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<WorkOrder>
  return NextResponse.json({ success: true, data: { ...workOrder, ...patch } })
}
