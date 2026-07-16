import { NextResponse } from "next/server"
import { serviceStats } from "@/app/api/_mock/db"

export function GET() {
  return NextResponse.json({ success: true, data: serviceStats })
}
