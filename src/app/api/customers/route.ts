import { NextRequest, NextResponse } from "next/server"
import { nextId, store } from "@/app/api/_mock/store"

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const q = searchParams.get("q")?.toLowerCase()

  let data = store.customers
  if (status) {
    data = data.filter((c) => c.status === status)
  }
  if (q) {
    data = data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const input = (await request.json()) as NewCustomerInput
  const customer: Customer = {
    id: nextId("cus"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    avatarUrl: "",
    status: "new",
    location: input.location,
    tags: [],
    lastInteraction: { type: "form_submitted", at: new Date().toISOString() },
    lifetimeValue: 0,
    vehicleIds: [],
    createdAt: new Date().toISOString(),
  }
  store.customers.unshift(customer)
  return NextResponse.json({ success: true, data: customer }, { status: 201 })
}
