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

    // Verify user has admin role
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
    // Get total users (excluding admin users)
    const adminRole = await prisma.role.findUnique({
      where: { name: "admin" },
    })
    
    const totalUsers = await prisma.user.count({
      where: adminRole ? {
        roleId: {
          not: adminRole.id,
        },
      } : undefined,
    })

    // Get total themes
    const totalThemes = await prisma.theme.count()

    // Get total sales (completed carts)
    const totalSales = await prisma.cart.count({
      where: { status: "COMPLETED" },
    })

    // Get total revenue from completed carts (before deduction)
    const revenueResult = await prisma.cart.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        total: true,
      },
    })

    const totalRevenue = Number(revenueResult._sum.total || 0)

    // Get total designer earnings from approved withdrawals
    const approvedWithdrawals = await prisma.withdrawalRequest.aggregate({
      where: { status: "APPROVED" },
      _sum: {
        approvedAmount: true,
      },
    })

    const totalDesignerPayments = Number(approvedWithdrawals._sum.approvedAmount || 0)
    const totalRevenueAfterDeduction = totalRevenue - totalDesignerPayments

    // Get total pending withdrawal amount
    const pendingWithdrawals = await prisma.withdrawalRequest.aggregate({
      where: { status: "PENDING" },
      _sum: {
        amount: true,
      },
    })

    const totalPendingPayments = Number(pendingWithdrawals._sum.amount || 0)

    return NextResponse.json({
      totalUsers,
      totalThemes,
      totalSales,
      totalRevenue, // Before deduction
      totalRevenueAfterDeduction, // After approved payments deduction
      totalPendingPayments, // Designer pending payments
    })
  } catch (error: any) {
    console.error("Error fetching admin dashboard stats:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

