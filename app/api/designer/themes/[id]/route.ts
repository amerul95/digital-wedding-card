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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const theme = await prisma.theme.findFirst({
      where: {
        id,
        designerId, // Ensure the theme belongs to the current designer
      },
      select: {
        id: true,
        name: true,
        configJson: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!theme) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      )
    }

    const config = theme.configJson ? JSON.parse(theme.configJson) : null

    return NextResponse.json({
      id: theme.id,
      name: theme.name,
      config,
      isPublished: theme.isPublished,
      createdAt: theme.createdAt.toISOString(),
      updatedAt: theme.updatedAt.toISOString(),
    })
  } catch (error: any) {
    console.error("Error fetching theme:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { name, config, isPublished } = body

    // Verify theme belongs to designer
    const existingTheme = await prisma.theme.findFirst({
      where: {
        id,
        designerId,
      },
    })

    if (!existingTheme) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      )
    }

    // Update the theme
    const theme = await prisma.theme.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(config && { configJson: JSON.stringify(config) }),
        ...(typeof isPublished === "boolean" && { isPublished }),
      },
    })

    return NextResponse.json({
      message: "Theme updated successfully",
      theme: {
        id: theme.id,
        name: theme.name,
      },
    })
  } catch (error: any) {
    console.error("Error updating theme:", error)
    
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

