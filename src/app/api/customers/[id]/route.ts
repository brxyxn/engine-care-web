import { NextRequest, NextResponse } from "next/server"
import { store } from "@/app/api/_mock/store"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const customer = store.customers.find((c) => c.id === id)
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
  const customer = store.customers.find((c) => c.id === id)
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    )
  }
  const patch = (await request.json()) as Partial<Customer>
  Object.assign(customer, patch, { id: customer.id })
  return NextResponse.json({ success: true, data: customer })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const index = store.customers.findIndex((c) => c.id === id)
  if (index !== -1) {
    store.customers.splice(index, 1)
  }
  return NextResponse.json({ success: true, data: { id } })
}
