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
    const carts = await prisma.cart.findMany({
      where: {
        status: {
          in: ["COMPLETED", "PENDING", "CANCELLED"],
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const orders = carts.map((cart) => ({
      id: cart.id,
      orderNumber: `ORD-${cart.id.slice(0, 8).toUpperCase()}`,
      customerEmail: cart.user.email,
      total: Number(cart.total),
      status: cart.status.toLowerCase() as "completed" | "pending" | "cancelled",
      createdAt: cart.createdAt.toISOString(),
      items: cart.items.map((item) => item.product.name),
    }))

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


