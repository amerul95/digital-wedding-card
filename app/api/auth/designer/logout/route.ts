import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  
  // Delete the designer session cookie
  cookieStore.delete("next-auth.session-token.designer")

  return NextResponse.json({ message: "Logged out successfully" })
}


