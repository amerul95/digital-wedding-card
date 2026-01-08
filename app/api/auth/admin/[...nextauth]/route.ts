import NextAuth from "next-auth"
import { createAuthConfig } from "@/lib/auth/config"

// Admin auth with separate cookie
const handler = NextAuth(createAuthConfig("admin"))

export { handler as GET, handler as POST }



