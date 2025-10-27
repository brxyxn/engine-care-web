import { NextResponse } from "next/server"
import { data } from "@/app/api/config/data"

export function GET() {
  return NextResponse.json({ success: true, data })
}
