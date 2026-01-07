import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  
  // Delete the admin session cookie
  cookieStore.delete("next-auth.session-token.admin")

  return NextResponse.json({ message: "Logged out successfully" })
}

