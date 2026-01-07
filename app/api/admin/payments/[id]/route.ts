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

// Approve or decline withdrawal request
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
    const { action, approvedAmount } = body // action: "approve" | "decline", approvedAmount is optional

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        designer: true,
      },
    })

    if (!request) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      )
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request is not pending" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      const finalAmount = approvedAmount !== undefined ? Number(approvedAmount) : Number(request.amount)

      // Verify account owner name matches designer name
      if (request.designer?.accountOwnerName && request.designer?.name) {
        const accountName = request.designer.accountOwnerName.toLowerCase().trim()
        const designerName = request.designer.name.toLowerCase().trim()
        
        if (accountName !== designerName) {
          return NextResponse.json(
            { error: "Account owner name does not match designer registered name. Payment cancelled." },
            { status: 400 }
          )
        }
      }

      // Update withdrawal request
      await prisma.withdrawalRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedAmount: finalAmount,
          approvedAt: new Date(),
        },
      })

      // Deduct from designer wallet
      if (request.designer) {
        await prisma.designer.update({
          where: { id: request.designerId },
          data: {
            walletBalance: {
              decrement: finalAmount,
            },
          },
        })
      }

      return NextResponse.json({
        message: "Withdrawal request approved successfully",
      })
    } else if (action === "decline") {
      await prisma.withdrawalRequest.update({
        where: { id },
        data: {
          status: "DECLINED",
        },
      })

      return NextResponse.json({
        message: "Withdrawal request declined",
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'decline'" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Error updating withdrawal request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

