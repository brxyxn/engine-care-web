import { NextRequest, NextResponse } from "next/server"
import { customers } from "@/app/api/_mock/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const customer = customers.find((c) => c.id === id)
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    )
  }
  return NextResponse.json({ success: true, data: customer })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const customer = customers.find((c) => c.id === id)
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Customer>
  return NextResponse.json({ success: true, data: { ...customer, ...patch } })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  return NextResponse.json({ success: true, data: { id } })
}
