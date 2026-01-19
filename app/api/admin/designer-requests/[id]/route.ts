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
    return payload.id as string
  } catch (error) {
    console.error("Error getting current admin ID:", error)
    return null
  }
}

// PATCH - Approve or reject designer role request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminId = await getCurrentAdminId()

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify admin has admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    const hasAdminRole = admin?.roles.some(ur => ur.role.name === "admin")
    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { action } = body // "approve" or "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Get the request
    const request = await prisma.designerRoleRequest.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true
              }
            }
          }
        }
      }
    })

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request has already been processed" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      // Get or create designer role
      let designerRole = await prisma.role.findUnique({
        where: { name: "designer" }
      })

      if (!designerRole) {
        designerRole = await prisma.role.create({
          data: { name: "designer" }
        })
      }

      // Check if user already has designer role
      const hasDesignerRole = request.user.roles.some(ur => ur.role.name === "designer")
      if (!hasDesignerRole) {
        // Add designer role to user
        await prisma.userRole.create({
          data: {
            userId: request.userId,
            roleId: designerRole.id
          }
        })
      }

      // Create designer profile if it doesn't exist
      const existingDesigner = await prisma.designer.findUnique({
        where: { userId: request.userId }
      })

      if (!existingDesigner) {
        await prisma.designer.create({
          data: {
            userId: request.userId,
            name: request.fullName
          }
        })
      }

      // Update request status
      await prisma.designerRoleRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedBy: adminId
        }
      })

      return NextResponse.json({
        message: "Designer role request approved successfully"
      })
    } else {
      // Reject request
      await prisma.designerRoleRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewedBy: adminId
        }
      })

      return NextResponse.json({
        message: "Designer role request rejected"
      })
    }
  } catch (error: any) {
    console.error("Error updating designer role request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
