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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id },
    })

    if (!request) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      )
    }

    if (request.designerId !== designerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending requests can be cancelled" },
        { status: 400 }
      )
    }

    await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "Withdrawal request cancelled successfully",
    })
  } catch (error: any) {
    console.error("Error cancelling withdrawal request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


