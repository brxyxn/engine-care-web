import { NextRequest, NextResponse } from "next/server"
import { nextId, vehicles } from "@/app/api/_mock/db"

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const make = searchParams.get("make")
  const q = searchParams.get("q")?.toLowerCase()

  let data = vehicles
  if (status) {
    data = data.filter((v) => v.status === status)
  }
  if (make) {
    data = data.filter((v) => v.make === make)
  }
  if (q) {
    data = data.filter((v) =>
      `${v.make} ${v.model} ${v.vin} ${v.licensePlate}`.toLowerCase().includes(q)
    )
  }
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as NewVehicleInput
  const vehicle: Vehicle = {
    id: nextId("veh"),
    customerId: input.customerId,
    make: input.make,
    model: input.model,
    year: input.year,
    vin: input.vin,
    licensePlate: input.licensePlate,
    mileage: input.mileage,
    engine: input.engine,
    transmission: input.transmission,
    fuelType: input.fuelType,
    photoUrl: "",
    status: "active",
    listPrice: null,
    lastServiceAt: null,
  }
  return NextResponse.json({ success: true, data: vehicle }, { status: 201 })
}
