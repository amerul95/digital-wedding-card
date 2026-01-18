import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getCookieName } from "./config"

const JWT_SECRET = process.env.JWT_SECRET || ""

export async function signIn(
  route: "client" | "designer" | "admin" | "unified",
  emailOrUsername: string,
  password: string
) {
  try {
    // Validate JWT_SECRET is set
    if (!JWT_SECRET || JWT_SECRET === "") {
      throw new Error("JWT_SECRET is not configured. Please add JWT_SECRET to your .env file.")
    }

    // For admin route, username is stored in the email field
    // For other routes, use email as normal
    const user = await prisma.user.findUnique({
      where: { email: emailOrUsername },
      include: { 
        role: true, // Keep for backward compatibility
      },
    })

    if (!user) {
      const errorMessage = route === "admin" 
        ? "Invalid username or password" 
        : "Invalid email or password"
      return { success: false, error: errorMessage }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      const errorMessage = route === "admin" 
        ? "Invalid username or password" 
        : "Invalid email or password"
      return { success: false, error: errorMessage }
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
    // If user has roles in UserRole table, use those; otherwise fall back to old role field
    const allRoles = userRoles.length > 0 
      ? userRoles 
      : (user.role?.name ? [user.role.name] : ["client"])
    
    // Check if user has client role (everyone is a client by default)
    const hasClientRole = allRoles.includes("client") || allRoles.length === 0
    const hasDesignerRole = allRoles.includes("designer")
    const hasAdminRole = allRoles.includes("admin")

    // For unified login, set cookie ONLY for primary role (best practice)
    if (route === "unified") {
      const cookieStore = await cookies()
      const userRolesForToken = allRoles.length > 0 ? allRoles : ["client"]
      
      // Determine primary role for redirect (priority: admin > designer > client)
      let primaryRole: "admin" | "designer" | "client" = "client"
      if (hasAdminRole) {
        primaryRole = "admin"
      } else if (hasDesignerRole) {
        primaryRole = "designer"
      }

      // Set cookie ONLY for the primary role (best practice - principle of least privilege)
      const primaryToken = jwt.sign(
        { id: user.id, email: user.email, role: primaryRole, roles: userRolesForToken },
        JWT_SECRET,
        { expiresIn: "7d" }
      )
      cookieStore.set({
        name: getCookieName(primaryRole as "client" | "designer" | "admin"),
        value: primaryToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: primaryRole,
          roles: userRolesForToken,
        },
        redirectRoute: primaryRole,
        allRoles: userRolesForToken,
      }
    }

    // For specific route logins, check if user has the required role
    if (route === "admin") {
      if (!hasAdminRole) {
        return { success: false, error: "Access denied. Admin role required." }
      }
    } else if (route === "designer") {
      if (!hasDesignerRole) {
        return { success: false, error: "Access denied. Designer role required." }
      }
    } else if (route === "client") {
      // Client access is allowed for everyone
      // No need to check specific role
    }

    // Create JWT token with all roles
    const userRolesForToken = allRoles.length > 0 ? allRoles : ["client"]
    const routeRole = route === "admin" ? "admin" : route === "designer" ? "designer" : "client"
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: routeRole, roles: userRolesForToken },
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
        role: routeRole,
        roles: userRolesForToken,
      },
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "An error occurred during sign in" }
  }
}


