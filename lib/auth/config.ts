import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Helper function to get cookie name based on route
export function getCookieName(route: "client" | "designer" | "admin"): string {
  switch (route) {
    case "client":
      return "next-auth.session-token.client"
    case "designer":
      return "next-auth.session-token.designer"
    case "admin":
      return "next-auth.session-token.admin"
    default:
      return "next-auth.session-token.client"
  }
}

// Create auth config for different routes
export function createAuthConfig(
  route: "client" | "designer" | "admin"
): any {
  const cookieName = getCookieName(route)
  
  return {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const email = credentials.email as string
          const password = credentials.password as string

          const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
          })

          if (!user) {
            return null
          }

          // Verify password
          const isValid = await bcrypt.compare(
            password,
            user.password
          )

          if (!isValid) {
            return null
          }

          // Check role based on route
          if (route === "admin") {
            if (user.role?.name !== "admin") {
              return null
            }
          } else if (route === "designer") {
            if (user.role?.name !== "designer") {
              return null
            }
          } else if (route === "client") {
            // Client can be any user without specific role or with client role
            if (user.role?.name === "admin" || user.role?.name === "designer") {
              return null
            }
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role?.name || "client",
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: `/${route}/login`,
    },
    callbacks: {
      async jwt({ token, user }: { token: any; user: any }) {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.role = user.role
        }
        return token
      },
      async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
          session.user.id = token.id as string
          session.user.role = token.role as string
        }
        return session
      },
    },
    cookies: {
      sessionToken: {
        name: cookieName,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  }
}



