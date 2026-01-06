import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getCookieName } from "./config"

const JWT_SECRET = process.env.JWT_SECRET || ""

export async function signIn(
  route: "client" | "designer" | "admin",
  email: string,
  password: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check role based on route
    if (route === "admin") {
      if (user.role?.name !== "admin") {
        return { success: false, error: "Access denied. Admin role required." }
      }
    } else if (route === "designer") {
      if (user.role?.name !== "designer") {
        return { success: false, error: "Access denied. Designer role required." }
      }
    } else if (route === "client") {
      // Client can be any user without specific role or with client role
      if (user.role?.name === "admin" || user.role?.name === "designer") {
        return { success: false, error: "Please use the correct login page for your role." }
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role?.name || "client" },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Set cookie with route-specific name
    const cookieName = getCookieName(route)
    ;(await cookies()).set({
      name: cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name || "client",
      },
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "An error occurred during sign in" }
  }
}

