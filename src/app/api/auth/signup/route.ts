import { NextRequest, NextResponse } from "next/server"
import {
  createOwnerAccount,
  emailTaken,
  SESSION_COOKIE,
} from "@/app/api/_mock/auth"

export async function POST(request: NextRequest) {
  const { name, email, password, shopName } = (await request.json()) as {
    name?: string
    email?: string
    password?: string
    shopName?: string
  }

  if (!name || !email || !password || !shopName) {
    return NextResponse.json(
      { success: false, error: "All fields are required" },
      { status: 400 }
    )
  }
  if (emailTaken(email)) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists" },
      { status: 409 }
    )
  }

  const session = createOwnerAccount({ name, email, password, shopName })
  const response = NextResponse.json(
    { success: true, data: session },
    { status: 201 }
  )
  response.cookies.set(SESSION_COOKIE, session.user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
