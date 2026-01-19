import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || ""
const ROOT_ADMIN_EMAIL = "mirolesuperman@gmail.com"

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

// DELETE - Delete user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getCurrentAdminId()

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get the user to be deleted
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { email: true }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deletion of root admin
    if (userToDelete.email === ROOT_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Cannot delete root admin user" },
        { status: 403 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "User deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
