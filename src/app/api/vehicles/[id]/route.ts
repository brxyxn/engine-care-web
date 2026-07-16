import { NextRequest, NextResponse } from "next/server"
import { vehicles } from "@/app/api/_mock/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const vehicle = vehicles.find((v) => v.id === id)
  if (!vehicle) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 }
    )
  }
  return NextResponse.json({ success: true, data: vehicle })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const vehicle = vehicles.find((v) => v.id === id)
  if (!vehicle) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Vehicle>
  return NextResponse.json({ success: true, data: { ...vehicle, ...patch } })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  return NextResponse.json({ success: true, data: { id } })
}
