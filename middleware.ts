import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || ""

const protectedRoutes = {
  client: ['/cart', '/profile', '/orders', '/favourites'],
  designer: ['/designer/dashboard'],
  admin: ['/admin/dashboard']
}

function getTokenFromRequest(req: NextRequest, route: "client" | "designer" | "admin"): string | null {
  const cookieName = route === "client" 
    ? "next-auth.session-token.client"
    : route === "designer"
    ? "next-auth.session-token.designer"
    : "next-auth.session-token.admin"
  
  return req.cookies.get(cookieName)?.value || null
}

// Check if user has any authenticated cookie (admin, designer, or client)
function hasAnyAuthenticatedCookie(req: NextRequest): boolean {
  const adminToken = req.cookies.get("next-auth.session-token.admin")?.value
  const designerToken = req.cookies.get("next-auth.session-token.designer")?.value
  const clientToken = req.cookies.get("next-auth.session-token.client")?.value
  
  return !!(adminToken || designerToken || clientToken)
}

async function verifyToken(token: string): Promise<{ id: string; email: string; role: string; roles?: string[] } | null> {
  try {
    if (!JWT_SECRET || JWT_SECRET === "") {
      console.error("Middleware: JWT_SECRET is not set!")
      return null
    }
    // jose uses TextEncoder for the secret
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: string; email: string; role: string; roles?: string[] }
  } catch (error: any) {
    console.error("Middleware: Token verification error:", error.message)
    console.error("Middleware: JWT_SECRET exists:", !!JWT_SECRET, "Length:", JWT_SECRET?.length)
    return null
  }
}

// Helper function to check if user has required role
function hasRole(decoded: { role: string; roles?: string[] }, requiredRole: string): boolean {
  // Check if user has the role in their roles array (multi-role support)
  if (decoded.roles && decoded.roles.includes(requiredRole)) {
    return true
  }
  // Fallback to single role check for backward compatibility
  return decoded.role === requiredRole
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname

  // Check client routes
  if (protectedRoutes.client.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "client")
    
    if (!token) {
      // No client cookie - check if user is authenticated with another role
      if (hasAnyAuthenticatedCookie(req)) {
        // User is authenticated but doesn't have client cookie
        // Redirect to role checker API which will check database and set cookie if user has role
        // (Everyone can be a client, so this will always succeed if authenticated)
        const checkRoleUrl = new URL('/api/auth/check-role', req.url)
        checkRoleUrl.searchParams.set('role', 'client')
        checkRoleUrl.searchParams.set('redirect', url)
        return NextResponse.redirect(checkRoleUrl)
      }
      
      // Not authenticated at all - redirect to home (login is handled by modal)
      const homeUrl = new URL('/', req.url)
      homeUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(homeUrl)
    }
    
    // Client cookie exists - verify it
    const decoded = await verifyToken(token)
    // Client access is allowed for everyone (all users can be clients)
    if (!decoded) {
      const homeUrl = new URL('/', req.url)
      homeUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(homeUrl)
    }
  }

  // Check designer routes
  if (protectedRoutes.designer.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "designer")
    
    if (!token) {
      // No designer cookie - check if user is authenticated with another role
      if (hasAnyAuthenticatedCookie(req)) {
        // User is authenticated but doesn't have designer cookie
        // Redirect to role checker API which will check database and set cookie if user has role
        const checkRoleUrl = new URL('/api/auth/check-role', req.url)
        checkRoleUrl.searchParams.set('role', 'designer')
        checkRoleUrl.searchParams.set('redirect', url)
        return NextResponse.redirect(checkRoleUrl)
      }
      
      // Not authenticated at all - redirect to login
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Designer cookie exists - verify it
    const decoded = await verifyToken(token)
    if (!decoded) {
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Verify user has designer role (supports multi-role)
    if (!hasRole(decoded, "designer")) {
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check admin routes
  if (protectedRoutes.admin.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "admin")
    
    if (!token) {
      // No admin cookie - check if user is authenticated with another role
      if (hasAnyAuthenticatedCookie(req)) {
        // User is authenticated but doesn't have admin cookie
        // Redirect to role checker API which will check database and set cookie if user has role
        const checkRoleUrl = new URL('/api/auth/check-role', req.url)
        checkRoleUrl.searchParams.set('role', 'admin')
        checkRoleUrl.searchParams.set('redirect', url)
        return NextResponse.redirect(checkRoleUrl)
      }
      
      // Not authenticated at all - redirect to login
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Admin cookie exists - verify it
    const decoded = await verifyToken(token)
    if (!decoded || !hasRole(decoded, "admin")) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = { 
  matcher: [
    '/cart/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/favourites/:path*',
    '/designer/dashboard/:path*',
    '/designer/dashboard',
    '/admin/dashboard/:path*',
    '/admin/dashboard'
  ]
}