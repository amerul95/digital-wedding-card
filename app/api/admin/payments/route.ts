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
    const withdrawalRequests = await prisma.withdrawalRequest.findMany({
      include: {
        designer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const requests = withdrawalRequests.map((request) => ({
      id: request.id,
      requestNumber: request.requestNumber,
      designerId: request.designerId,
      designerName: request.designer?.name || "Unknown",
      designerEmail: request.designer?.user?.email || "Unknown",
      amount: Number(request.amount),
      approvedAmount: request.approvedAmount ? Number(request.approvedAmount) : null,
      status: request.status.toLowerCase() as "pending" | "approved" | "declined" | "cancelled",
      createdAt: request.createdAt.toISOString(),
      approvedAt: request.approvedAt?.toISOString() || null,
      cancelledAt: request.cancelledAt?.toISOString() || null,
      bankName: request.designer?.bankName || null,
      accountOwnerName: request.designer?.accountOwnerName || null,
      accountNumber: request.designer?.accountNumber || null,
    }))

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error("Error fetching withdrawal requests:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

