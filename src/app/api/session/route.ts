import { NextRequest, NextResponse } from "next/server"
import { findByUserId, SESSION_COOKIE } from "@/app/api/_mock/auth"

/** Current session from the auth cookie; 401 when signed out. */
export function GET(request: NextRequest) {
  const userId = request.cookies.get(SESSION_COOKIE)?.value
  const session = userId ? findByUserId(userId) : null
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    )
  }
  return NextResponse.json({ success: true, data: session })
}
