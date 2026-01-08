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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getCurrentAdminId()

  if (!adminId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { action } = body // "approve" or "reject"

    // Find the theme
    const existingTheme = await prisma.theme.findUnique({
      where: { id },
    })

    if (!existingTheme) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      )
    }

    // Update theme status based on action
    if (action === "approve") {
      const theme = await prisma.theme.update({
        where: { id },
        data: {
          isPublished: true,
        },
      })

      return NextResponse.json({
        message: "Theme approved and published successfully",
        theme: {
          id: theme.id,
          name: theme.name,
          isPublished: theme.isPublished,
        },
      })
    } else if (action === "reject") {
      // For rejection, we could delete the theme or just keep it unpublished
      // For now, we'll just keep it unpublished (isPublished: false)
      // You can add a rejection reason or delete logic if needed
      return NextResponse.json({
        message: "Theme rejected",
        theme: {
          id: existingTheme.id,
          name: existingTheme.name,
          isPublished: false,
        },
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Error updating theme status:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


