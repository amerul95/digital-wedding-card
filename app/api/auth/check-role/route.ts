import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkAndSetRoleCookie, getUserIdFromAnyCookie } from "@/lib/auth/role-checker"

/**
 * API route to check if user has a role and set cookie on-demand
 * Called by middleware when user tries to access a role-specific area
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const requiredRole = searchParams.get("role") as "admin" | "designer" | "client" | null
    const redirectUrl = searchParams.get("redirect") || "/"

    if (!requiredRole || !["admin", "designer", "client"].includes(requiredRole)) {
      return NextResponse.json(
        { error: "Invalid role parameter" },
        { status: 400 }
      )
    }

    // Get user ID from any authenticated cookie
    const userId = await getUserIdFromAnyCookie()

    if (!userId) {
      // User not authenticated at all - redirect to appropriate login
      const loginUrl = requiredRole === "admin" 
        ? "/admin/login"
        : requiredRole === "designer"
        ? "/designer/login"
        : "/" // Client login is handled by modal on home page
      
      return NextResponse.redirect(new URL(loginUrl, req.url))
    }

    // Check if user has the required role and set cookie on-demand
    const hasRole = await checkAndSetRoleCookie(userId, requiredRole)

    if (!hasRole) {
      // User doesn't have this role - redirect to home page with error message
      // For admin/designer roles, redirect to their specific login page
      const redirectUrl = requiredRole === "admin" 
        ? "/admin/login"
        : requiredRole === "designer"
        ? "/designer/login"
        : "/" // Client login is handled by modal on home page
      
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // User has the role and cookie is now set - redirect to requested URL
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  } catch (error) {
    console.error("Check role error:", error)
    return NextResponse.redirect(new URL("/", req.url))
  }
}
