import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || ""

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.client")?.value

    if (!token || !JWT_SECRET) {
      return NextResponse.json({ authenticated: false })
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    // Client can be any user without admin/designer role
    if (payload.role && payload.role !== "admin" && payload.role !== "designer") {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}

