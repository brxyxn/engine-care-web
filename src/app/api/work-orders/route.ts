import { NextRequest, NextResponse } from "next/server"
import { nextId, nextWorkOrderNumber, store } from "@/app/api/_mock/store"

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const assignedMechanicId = searchParams.get("assignedMechanicId")

  let data = store.workOrders
  if (status) {
    data = data.filter((wo) => wo.status === status)
  }
  if (assignedMechanicId) {
    data = data.filter((wo) => wo.assignedMechanicId === assignedMechanicId)
  }
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as Partial<WorkOrder>
  const now = new Date().toISOString()
  const workOrder: WorkOrder = {
    id: nextId("wo"),
    number: nextWorkOrderNumber(),
    customerId: input.customerId ?? "",
    vehicleId: input.vehicleId ?? "",
    assignedMechanicId: input.assignedMechanicId ?? null,
    status: input.status ?? "intake",
    priority: input.priority ?? "normal",
    serviceType: input.serviceType ?? "general_repair",
    title: input.title ?? "New work order",
    description: input.description ?? "",
    progressPct: 0,
    lineItems: input.lineItems ?? [],
    estimateTotal: input.estimateTotal ?? 0,
    scheduledAt: input.scheduledAt ?? null,
    completedAt: null,
    notes: [],
    createdAt: now,
  }
  store.workOrders.unshift(workOrder)
  return NextResponse.json({ success: true, data: workOrder }, { status: 201 })
}
