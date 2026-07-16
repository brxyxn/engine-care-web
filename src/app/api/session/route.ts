import { NextResponse } from "next/server"
import { sessions } from "@/app/api/_mock/db"

export function GET() {
  return NextResponse.json({ success: true, data: sessions.owner })
}
