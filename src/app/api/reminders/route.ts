import { NextResponse } from "next/server"
import { store } from "@/app/api/_mock/store"

export function GET() {
  return NextResponse.json({ success: true, data: store.reminders })
}
