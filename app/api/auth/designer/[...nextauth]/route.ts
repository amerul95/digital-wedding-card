import NextAuth from "next-auth"
import { createAuthConfig } from "@/lib/auth/config"

// Designer auth with separate cookie
const handler = NextAuth(createAuthConfig("designer"))

export { handler as GET, handler as POST }


