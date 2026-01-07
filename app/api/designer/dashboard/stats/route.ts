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
    // Get total themes
    const totalThemes = await prisma.theme.count({
      where: { designerId },
    })

    // Get published themes
    const publishedThemes = await prisma.theme.count({
      where: {
        designerId,
        isPublished: true,
      },
    })

    // Get total sales
    const totalSales = await prisma.themeSale.count({
      where: { designerId },
    })

    // Get total earnings
    const earningsResult = await prisma.themeSale.aggregate({
      where: { designerId },
      _sum: {
        designerEarning: true,
      },
    })

    const totalEarnings = Number(earningsResult._sum.designerEarning || 0)

    // Get monthly earnings for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const sales = await prisma.themeSale.findMany({
      where: {
        designerId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        designerEarning: true,
      },
    })

    // Group by month
    const monthlyEarnings: Record<string, number> = {}
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    sales.forEach((sale) => {
      const date = new Date(sale.createdAt)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      monthlyEarnings[monthKey] = (monthlyEarnings[monthKey] || 0) + Number(sale.designerEarning)
    })

    // Get last 6 months
    const chartData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      chartData.push({
        month: monthNames[date.getMonth()],
        earnings: monthlyEarnings[monthKey] || 0,
      })
    }

    // Get recent activity (last 5 sales and theme publications)
    const recentSales = await prisma.themeSale.findMany({
      where: { designerId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        theme: {
          select: {
            name: true,
          },
        },
      },
    })

    const recentThemes = await prisma.theme.findMany({
      where: { designerId },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        name: true,
        isPublished: true,
        updatedAt: true,
      },
    })

    // Combine and sort recent activity
    const recentActivity = [
      ...recentSales.map((sale) => ({
        type: "sale" as const,
        title: "New Sale",
        description: sale.theme.name,
        amount: Number(sale.designerEarning),
        date: sale.createdAt,
      })),
      ...recentThemes
        .filter((theme) => theme.isPublished)
        .map((theme) => ({
          type: "publish" as const,
          title: "Theme Published",
          description: theme.name,
          amount: 0,
          date: theme.updatedAt,
        })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)

    return NextResponse.json({
      totalThemes,
      publishedThemes,
      totalSales,
      totalEarnings,
      chartData,
      recentActivity,
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

