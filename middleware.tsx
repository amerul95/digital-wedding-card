import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"

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

function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname

  // Check client routes
  if (protectedRoutes.client.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "client")
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    const decoded = verifyToken(token)
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
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "designer") {
      const loginUrl = new URL('/designer/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check admin routes
  if (protectedRoutes.admin.some(route => url.startsWith(route))) {
    const token = getTokenFromRequest(req, "admin")
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', url)
      return NextResponse.redirect(loginUrl)
    }
    const decoded = verifyToken(token)
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
    '/admin/dashboard/:path*'
  ]
}