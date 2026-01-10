import NextAuth from "next-auth"
import { createAuthConfig } from "@/lib/auth/config"
import type { NextRequest } from "next/server"

// Admin auth with separate cookie
const authConfig = createAuthConfig("admin")
const { handlers } = NextAuth(authConfig)

export async function GET(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  return handlers.GET(request)
}

export async function POST(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  return handlers.POST(request)
}



