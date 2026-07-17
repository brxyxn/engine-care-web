import { NextRequest, NextResponse } from "next/server"
import { store } from "@/app/api/_mock/store"

type Params = { params: Promise<{ id: string }> }

/** Confirm, reschedule, or cancel an appointment. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const appointment = store.appointments.find((a) => a.id === id)
  if (!appointment) {
    return NextResponse.json(
      { success: false, error: "Appointment not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Appointment>
  Object.assign(appointment, patch, { id: appointment.id })
  return NextResponse.json({ success: true, data: appointment })
}
