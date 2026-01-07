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

// Get designer profile
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
      select: {
        id: true,
        name: true,
        address: true,
        bio: true,
        bankName: true,
        accountOwnerName: true,
        accountNumber: true,
        walletBalance: true,
      },
    })

    if (!designer) {
      return NextResponse.json(
        { error: "Designer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...designer,
      walletBalance: Number(designer.walletBalance),
    })
  } catch (error: any) {
    console.error("Error fetching designer profile:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// Update designer profile (including payment details)
export async function PUT(req: Request) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { name, address, bio, bankName, accountOwnerName, accountNumber } = body

    // Verify account owner name matches designer name if both are provided
    if (accountOwnerName && name) {
      const accountName = accountOwnerName.toLowerCase().trim()
      const designerName = name.toLowerCase().trim()
      
      if (accountName !== designerName) {
        return NextResponse.json(
          { error: "Account owner name must match your registered designer name" },
          { status: 400 }
        )
      }
    }

    // If updating account owner name, verify it matches current designer name
    if (accountOwnerName) {
      const designer = await prisma.designer.findUnique({
        where: { id: designerId },
        select: { name: true },
      })

      if (designer?.name) {
        const accountName = accountOwnerName.toLowerCase().trim()
        const designerName = designer.name.toLowerCase().trim()
        
        if (accountName !== designerName) {
          return NextResponse.json(
            { error: "Account owner name must match your registered designer name" },
            { status: 400 }
          )
        }
      }
    }

    const updatedDesigner = await prisma.designer.update({
      where: { id: designerId },
      data: {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(bio !== undefined && { bio }),
        ...(bankName !== undefined && { bankName }),
        ...(accountOwnerName !== undefined && { accountOwnerName }),
        ...(accountNumber !== undefined && { accountNumber }),
      },
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      designer: {
        id: updatedDesigner.id,
        name: updatedDesigner.name,
        address: updatedDesigner.address,
        bio: updatedDesigner.bio,
        bankName: updatedDesigner.bankName,
        accountOwnerName: updatedDesigner.accountOwnerName,
        accountNumber: updatedDesigner.accountNumber,
      },
    })
  } catch (error: any) {
    console.error("Error updating designer profile:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

