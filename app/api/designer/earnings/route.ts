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
    // Get all theme sales for this designer
    const sales = await prisma.themeSale.findMany({
      where: { designerId },
      orderBy: { createdAt: "desc" },
      include: {
        theme: {
          select: {
            name: true,
          },
        },
        cart: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    })

    const earnings = sales.map((sale) => ({
      id: sale.id,
      themeName: sale.theme.name,
      saleDate: sale.createdAt.toISOString(),
      salePrice: Number(sale.salePrice),
      designerEarning: Number(sale.designerEarning),
      companyEarning: Number(sale.companyEarning),
      customerEmail: sale.cart.user.email,
    }))

    return NextResponse.json(earnings)
  } catch (error: any) {
    console.error("Error fetching earnings:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

