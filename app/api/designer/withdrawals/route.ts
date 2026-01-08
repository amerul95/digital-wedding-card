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

// Get designer wallet and withdrawal requests
export async function GET() {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const designer = await prisma.designer.findUnique({
      where: { id: designerId },
      include: {
        withdrawalRequests: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!designer) {
      return NextResponse.json(
        { error: "Designer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      walletBalance: Number(designer.walletBalance),
      bankName: designer.bankName,
      accountOwnerName: designer.accountOwnerName,
      accountNumber: designer.accountNumber,
      withdrawalRequests: designer.withdrawalRequests.map((req) => ({
        id: req.id,
        requestNumber: req.requestNumber,
        amount: Number(req.amount),
        approvedAmount: req.approvedAmount ? Number(req.approvedAmount) : null,
        status: req.status.toLowerCase() as "pending" | "approved" | "declined" | "cancelled",
        createdAt: req.createdAt.toISOString(),
        approvedAt: req.approvedAt?.toISOString() || null,
        cancelledAt: req.cancelledAt?.toISOString() || null,
      })),
    })
  } catch (error: any) {
    console.error("Error fetching designer wallet:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// Create withdrawal request
export async function POST(req: Request) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    const designer = await prisma.designer.findUnique({
      where: { id: designerId },
    })

    if (!designer) {
      return NextResponse.json(
        { error: "Designer not found" },
        { status: 404 }
      )
    }

    // Check if payment details are filled
    if (!designer.bankName || !designer.accountOwnerName || !designer.accountNumber) {
      return NextResponse.json(
        { error: "Please fill in your payment details in profile settings first" },
        { status: 400 }
      )
    }

    // Verify account owner name matches designer name
    if (designer.accountOwnerName && designer.name) {
      const accountName = designer.accountOwnerName.toLowerCase().trim()
      const designerName = designer.name.toLowerCase().trim()
      
      if (accountName !== designerName) {
        return NextResponse.json(
          { error: "Account owner name must match your registered designer name" },
          { status: 400 }
        )
      }
    }

    // Check wallet balance
    const walletBalance = Number(designer.walletBalance)
    if (walletBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient wallet balance" },
        { status: 400 }
      )
    }

    // Create withdrawal request
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        designerId,
        amount,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      message: "Withdrawal request created successfully",
      request: {
        id: withdrawalRequest.id,
        requestNumber: withdrawalRequest.requestNumber,
        amount: Number(withdrawalRequest.amount),
        status: withdrawalRequest.status.toLowerCase(),
        createdAt: withdrawalRequest.createdAt.toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Error creating withdrawal request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


