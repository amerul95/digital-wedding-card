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

    // Filter to only show templates (not themes or content)
    const templatesWithStats = themes
      .filter((theme) => {
        if (!theme.configJson) return false
        try {
          const config = JSON.parse(theme.configJson)
          return config.type === 'template'
        } catch {
          return false
        }
      })
      .map((theme) => ({
        id: theme.id,
        name: theme.name,
        designer: theme.designer?.user?.email || "Unknown",
        status: theme.isPublished ? "published" : "pending",
        createdAt: theme.createdAt.toISOString(),
        sales: theme.sales.length,
        revenue: Number(theme.sales.reduce((sum, sale) => sum + Number(sale.salePrice), 0)),
      }))

    return NextResponse.json(templatesWithStats)
  } catch (error: any) {
    console.error("Error fetching themes:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const adminId = await getCurrentAdminId()

  if (!adminId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. 'ids' must be a non-empty array" },
        { status: 400 }
      )
    }

    // Verify all themes exist
    const existingThemes = await prisma.theme.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
      },
    })

    if (existingThemes.length !== ids.length) {
      return NextResponse.json(
        { error: "Some themes were not found" },
        { status: 404 }
      )
    }

    // Delete themes in bulk
    const deleteResult = await prisma.theme.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} template(s)`,
      deletedCount: deleteResult.count,
      deletedThemes: existingThemes.map((t) => ({ id: t.id, name: t.name })),
    })
  } catch (error: any) {
    console.error("Error bulk deleting themes:", error)

    // Handle foreign key constraint errors
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete some themes. They are being used by other records." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

