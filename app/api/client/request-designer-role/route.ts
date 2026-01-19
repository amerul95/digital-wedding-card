import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"
import { z } from "zod"

const JWT_SECRET = process.env.JWT_SECRET || ""

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.client")?.value

    if (!token || !JWT_SECRET) {
      return null
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload.id as string
  } catch (error) {
    console.error("Error getting current user ID:", error)
    return null
  }
}

const RequestSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }).min(1, {
    message: "Email is required"
  })
})

// POST - Submit designer role request
export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      )
    }

    // Check if user already has designer role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user already has designer role
    const hasDesignerRole = user.roles.some(ur => ur.role.name === "designer")
    if (hasDesignerRole) {
      return NextResponse.json(
        { error: "You already have designer role" },
        { status: 400 }
      )
    }

    // Check if user already has a pending request
    const existingRequest = await prisma.designerRoleRequest.findFirst({
      where: {
        userId: userId,
        status: "PENDING"
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending designer role request" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Verify that the email matches the authenticated user's email
    if (user.email !== parsed.data.email) {
      return NextResponse.json(
        { error: "Email does not match your account email" },
        { status: 400 }
      )
    }

    // Check if email is already used by another user (shouldn't happen, but safety check)
    const emailUser = await prisma.user.findUnique({
      where: { email: parsed.data.email }
    })

    if (!emailUser || emailUser.id !== userId) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      )
    }

    // Create designer role request (storing email in fullName field for now)
    // Note: In a future migration, we could rename fullName to email in the schema
    const request = await prisma.designerRoleRequest.create({
      data: {
        userId: userId,
        fullName: parsed.data.email, // Store email in fullName field
        status: "PENDING"
      }
    })

    return NextResponse.json({
      message: "Designer role request submitted successfully",
      request: {
        id: request.id,
        status: request.status
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating designer role request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// GET - Check if user has pending request
export async function GET() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const request = await prisma.designerRoleRequest.findFirst({
      where: {
        userId: userId,
        status: "PENDING"
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      hasPendingRequest: !!request,
      request: request ? {
        id: request.id,
        status: request.status,
        createdAt: request.createdAt
      } : null
    })
  } catch (error: any) {
    console.error("Error checking designer role request:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
