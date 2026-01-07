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
    // Get roles to filter - only show clients (users without admin or designer role)
    const adminRole = await prisma.role.findUnique({
      where: { name: "admin" },
    })
    const designerRole = await prisma.role.findUnique({
      where: { name: "designer" },
    })

    const excludeRoleIds = []
    if (adminRole) excludeRoleIds.push(adminRole.id)
    if (designerRole) excludeRoleIds.push(designerRole.id)

    const users = await prisma.user.findMany({
      where: excludeRoleIds.length > 0 ? {
        OR: [
          { roleId: null }, // Users without role (default clients)
          { roleId: { notIn: excludeRoleIds } }, // Users with client role if it exists
        ],
      } : {
        roleId: null, // If no admin/designer roles exist, just show users without role
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
        cart: {
          where: {
            status: "COMPLETED",
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const usersWithStats = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role?.name || "client",
      createdAt: user.createdAt.toISOString(),
      orders: user.cart.length,
      status: "active" as const, // You can add a status field to User model if needed
    }))

    return NextResponse.json(usersWithStats)
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

