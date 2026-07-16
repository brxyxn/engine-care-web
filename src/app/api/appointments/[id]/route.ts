import { NextRequest, NextResponse } from "next/server"
import { appointments } from "@/app/api/_mock/db"

type Params = { params: Promise<{ id: string }> }

/** Confirm, reschedule, or cancel an appointment. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const appointment = appointments.find((a) => a.id === id)
  if (!appointment) {
    return NextResponse.json(
      { success: false, error: "Appointment not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Appointment>
  return NextResponse.json({
    success: true,
    data: { ...appointment, ...patch },
  })
}
