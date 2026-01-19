import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

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
      // Get user info from database
      const userId = payload.id as string
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
        },
      })

      const email = user?.email || payload.email as string || ''
      
      // Use name from JWT token if available, otherwise extract from email
      const name = (payload.name as string) || email.split('@')[0]

      return NextResponse.json({ 
        authenticated: true,
        email: email,
        name: name
      })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}


