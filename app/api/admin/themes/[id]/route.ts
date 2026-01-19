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

export async function DELETE(
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

    // Delete the theme (cascade will handle related records if configured)
    await prisma.theme.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Theme deleted successfully",
      theme: {
        id: existingTheme.id,
        name: existingTheme.name,
      },
    })
  } catch (error: any) {
    console.error("Error deleting theme:", error)
    
    // Handle foreign key constraint errors
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete theme. It is being used by other records." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
