import { NextRequest, NextResponse } from "next/server"
import { findByCredentials, SESSION_COOKIE } from "@/app/api/_mock/auth"

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required" },
      { status: 400 }
    )
  }

  const session = findByCredentials(email, password)
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password" },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true, data: session })
  response.cookies.set(SESSION_COOKIE, session.user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
