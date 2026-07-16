import { NextResponse } from "next/server"
import { invoices } from "@/app/api/_mock/db"

export function GET() {
  return NextResponse.json({ success: true, data: invoices })
}
