import NextAuth from "next-auth"
import { createAuthConfig } from "@/lib/auth/config"

// Default client auth
const handler = NextAuth(createAuthConfig("client"))

export { handler as GET, handler as POST }

