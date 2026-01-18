import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getCookieName } from "./config"

const JWT_SECRET = process.env.JWT_SECRET || ""

/**
 * Check if user has a specific role and set cookie on-demand
 * This allows seamless role switching without logout/login
 */
export async function checkAndSetRoleCookie(
  userId: string,
  requiredRole: "admin" | "designer" | "client"
): Promise<boolean> {
  try {
    // Get user with old role (backward compatibility)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true
      },
    })

    if (!user) {
      return false
    }

    // Get all user roles from UserRole table (many-to-many relationship)
    // Query directly to avoid Prisma type issues until client is regenerated
    let userRoles: string[] = []
    try {
      const userRoleRecords = await (prisma as any).userRole.findMany({
        where: { userId: user.id },
        include: { role: true }
      })
      userRoles = (userRoleRecords || []).map((ur: any) => ur.role?.name).filter(Boolean)
    } catch (error) {
      // UserRole table might not exist yet if migration hasn't been run
      // Fall back to old roleId field
      console.log("UserRole table query failed, using roleId fallback:", error)
    }
    
    // For backward compatibility, also check the old roleId field
    const allRoles = userRoles.length > 0 
      ? userRoles 
      : (user.role?.name ? [user.role.name] : ["client"])

    // Check if user has the required role
    // Everyone can be a client by default
    const hasRequiredRole = requiredRole === "client" 
      ? true // Everyone can access client areas
      : allRoles.includes(requiredRole)

    if (!hasRequiredRole) {
      return false
    }

    // User has the role - set the cookie on-demand
    const cookieStore = await cookies()
    const token = jwt.sign(
      { id: user.id, email: user.email, role: requiredRole, roles: allRoles },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    cookieStore.set({
      name: getCookieName(requiredRole),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    })

    return true
  } catch (error) {
    console.error("Error checking and setting role cookie:", error)
    return false
  }
}

/**
 * Get user ID from any authenticated cookie (admin, designer, or client)
 */
export async function getUserIdFromAnyCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    
    // Try to get user ID from any role cookie
    const adminCookie = cookieStore.get(getCookieName("admin"))?.value
    const designerCookie = cookieStore.get(getCookieName("designer"))?.value
    const clientCookie = cookieStore.get(getCookieName("client"))?.value

    const token = adminCookie || designerCookie || clientCookie

    if (!token || !JWT_SECRET) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    return decoded.id
  } catch (error) {
    return null
  }
}
