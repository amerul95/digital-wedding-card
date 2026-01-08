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
    const themes = await prisma.theme.findMany({
      include: {
        designer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        sales: {
          select: {
            salePrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const themesWithStats = themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      designer: theme.designer?.user?.email || "Unknown",
      status: theme.isPublished ? "published" : "pending",
      createdAt: theme.createdAt.toISOString(),
      sales: theme.sales.length,
      revenue: Number(theme.sales.reduce((sum, sale) => sum + sale.salePrice, 0)),
    }))

    return NextResponse.json(themesWithStats)
  } catch (error: any) {
    console.error("Error fetching themes:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


