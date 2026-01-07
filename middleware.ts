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

async function verifyToken(token: string): Promise<{ id: string; email: string; role: string } | null> {
  try {
    if (!JWT_SECRET || JWT_SECRET === "") {
      console.error("Middleware: JWT_SECRET is not set!")
      return null
    }
    // jose uses TextEncoder for the secret
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: string; email: string; role: string }
  } catch (error: any) {
    console.error("Middleware: Token verification error:", error.message)
    console.error("Middleware: JWT_SECRET exists:", !!JWT_SECRET, "Length:", JWT_SECRET?.length)
    return null
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname

  // Check client routes
  if (protectedRoutes.client.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "client")
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "client") {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check designer routes
  if (protectedRoutes.designer.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "designer")
    if (!token) {
      console.log("Middleware: No designer token found, redirecting to login")
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    console.log("Middleware: Token found, length:", token.length, "First 20 chars:", token.substring(0, 20))
    const decoded = await verifyToken(token)
    if (!decoded) {
      console.log("Middleware: Token verification failed, redirecting to login")
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    // Verify role matches
    if (decoded.role !== "designer") {
      console.log("Middleware: Role mismatch, redirecting to login. Role:", decoded.role)
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    console.log("Middleware: Designer authenticated successfully")
  }

  // Check admin routes
  if (protectedRoutes.admin.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "admin")
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
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