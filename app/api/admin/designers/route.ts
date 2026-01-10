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
    const userId = payload.id as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    })

    if (!user || user.role?.name !== "admin") {
      return null
    }

    return userId
  } catch (error) {
    console.error("Error getting current admin ID:", error)
    return null
  }
}

export async function GET() {
  const adminId = await getCurrentAdminId()

  if (!adminId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const designers = await prisma.designer.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        themes: {
          select: {
            id: true,
          },
        },
        sales: {
          select: {
            designerEarning: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const designersWithStats = designers.map((designer) => ({
      id: designer.id,
      email: designer.user.email,
      name: designer.name || "Unknown",
      themes: designer.themes.length,
      totalSales: designer.sales.length,
      totalEarnings: Number(
        designer.sales.reduce((sum, sale) => sum + Number(sale.designerEarning), 0)
      ),
      joinedDate: designer.createdAt.toISOString(),
    }))

    return NextResponse.json(designersWithStats)
  } catch (error: any) {
    console.error("Error fetching designers:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


