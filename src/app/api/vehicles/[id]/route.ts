import { NextRequest, NextResponse } from "next/server"
import { store } from "@/app/api/_mock/store"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const vehicle = store.vehicles.find((v) => v.id === id)
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
  const vehicle = store.vehicles.find((v) => v.id === id)
  if (!vehicle) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Vehicle>
  Object.assign(vehicle, patch, { id: vehicle.id })
  return NextResponse.json({ success: true, data: vehicle })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const index = store.vehicles.findIndex((v) => v.id === id)
  if (index !== -1) {
    store.vehicles.splice(index, 1)
  }
  return NextResponse.json({ success: true, data: { id } })
}
