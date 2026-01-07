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

export async function PATCH(
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
    const { isPublished } = body

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

    // Update the theme publish status
    const theme = await prisma.theme.update({
      where: { id },
      data: {
        isPublished: isPublished === true,
      },
    })

    return NextResponse.json({
      message: theme.isPublished ? "Theme published successfully" : "Theme unpublished successfully",
      theme: {
        id: theme.id,
        name: theme.name,
        isPublished: theme.isPublished,
      },
    })
  } catch (error: any) {
    console.error("Error updating theme publish status:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

