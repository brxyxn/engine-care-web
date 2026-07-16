import { NextRequest, NextResponse } from "next/server"
import { appointments, nextId } from "@/app/api/_mock/db"

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const customerId = searchParams.get("customerId")
  const status = searchParams.get("status")

  let data = appointments
  if (customerId) {
    data = data.filter((a) => a.customerId === customerId)
  }
  if (status) {
    data = data.filter((a) => a.status === status)
  }
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as Omit<Appointment, "id" | "status">
  const appointment: Appointment = {
    ...input,
    id: nextId("app"),
    status: "pending",
  }
  return NextResponse.json(
    { success: true, data: appointment },
    { status: 201 }
  )
}
