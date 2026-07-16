import { NextResponse } from "next/server"
import { notifications } from "@/app/api/_mock/db"

export function GET() {
  return NextResponse.json({ success: true, data: notifications })
}
