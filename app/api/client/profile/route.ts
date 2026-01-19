import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

// GET - Get client profile
export async function GET() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get name from JWT token if available
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.client")?.value
    let name = null
    let phone = null

    if (token && JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        name = (payload.name as string) || null
        phone = (payload.phone as string) || null
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: name,
      phone: phone,
      createdAt: user.createdAt,
    })
  } catch (error: any) {
    console.error("Error fetching client profile:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update client profile
export async function PUT(req: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, phone } = body

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update JWT token with new name and phone
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.client")?.value

    if (token && JWT_SECRET) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)

        // Create updated token with new name/phone
        const updatedPayload: any = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          roles: payload.roles,
        }

        if (name !== undefined && name !== null) {
          updatedPayload.name = name
        } else if (payload.name) {
          updatedPayload.name = payload.name
        }

        if (phone !== undefined && phone !== null) {
          updatedPayload.phone = phone
        } else if (payload.phone) {
          updatedPayload.phone = payload.phone
        }

        const newToken = jwt.sign(updatedPayload, JWT_SECRET, { expiresIn: "7d" })

        cookieStore.set({
          name: "next-auth.session-token.client",
          value: newToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
        })
      } catch (error) {
        console.error("Error updating token:", error)
      }
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      name: name,
      phone: phone,
    })
  } catch (error: any) {
    console.error("Error updating client profile:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
