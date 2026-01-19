import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || ""

async function getCurrentAdminId() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.admin")?.value

    if (!token || !JWT_SECRET) {
      return null
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload.id as string
  } catch (error) {
    console.error("Error getting current admin ID:", error)
    return null
  }
}

// GET - Get all designer role requests
export async function GET() {
  try {
    const adminId = await getCurrentAdminId()

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify admin has admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    const hasAdminRole = admin?.roles.some(ur => ur.role.name === "admin")
    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      )
    }

    const requests = await prisma.designerRoleRequest.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Error fetching designer role requests:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
