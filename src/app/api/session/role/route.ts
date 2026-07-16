import { NextRequest, NextResponse } from "next/server"
import { sessions } from "@/app/api/_mock/db"

/** Dev-only role switcher: returns the mock session for the requested role. */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role?: StaffRole }
  const role = body.role
  if (!role || !(role in sessions)) {
    return NextResponse.json(
      { success: false, error: "Unknown role" },
      { status: 400 }
    )
  }
  return NextResponse.json({ success: true, data: sessions[role] })
}
