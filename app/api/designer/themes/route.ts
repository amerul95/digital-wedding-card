import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || ""

async function getCurrentDesignerId() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.designer")?.value

    if (!token || !JWT_SECRET) {
      return null
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.id as string

    const designer = await prisma.designer.findUnique({
      where: { userId },
      select: { id: true },
    })

    return designer?.id || null
  } catch (error) {
    console.error("Error getting current designer ID:", error)
    return null
  }
}

export async function GET() {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Get all themes for this designer
    const themes = await prisma.theme.findMany({
      where: { designerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        isPublished: true,
        createdAt: true,
        previewImageUrl: true,
        configJson: true,
      },
    })

    // Get sales count and earnings for each theme
    const themesWithStats = await Promise.all(
      themes.map(async (theme) => {
        const sales = await prisma.themeSale.findMany({
          where: { themeId: theme.id, designerId },
        })

        const salesCount = sales.length
        const earnings = sales.reduce(
          (sum, sale) => sum + Number(sale.designerEarning),
          0
        )

        const config = theme.configJson ? JSON.parse(theme.configJson) : null

        return {
          id: theme.id,
          name: theme.name,
          status: theme.isPublished ? "published" : "draft",
          createdAt: theme.createdAt.toISOString(),
          sales: salesCount,
          earnings: earnings,
          previewImage: theme.previewImageUrl || null,
          config: config,
        }
      })
    )

    return NextResponse.json(themesWithStats)
  } catch (error: any) {
    console.error("Error fetching themes:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { name, config } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Theme name is required" },
        { status: 400 }
      )
    }

    // Create the theme
    const theme = await prisma.theme.create({
      data: {
        name: name.trim(),
        designerId,
        configJson: JSON.stringify(config),
        isPublished: false, // Default to draft
      },
    })

    return NextResponse.json(
      { 
        message: "Theme created successfully",
        theme: {
          id: theme.id,
          name: theme.name,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating theme:", error)
    
    // Handle unique constraint violation (duplicate theme name)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A theme with this name already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

