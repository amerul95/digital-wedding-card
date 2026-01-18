import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth/helpers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await signIn("unified", email, password)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials" },
        { status: 401 }
      )
    }

    // Determine redirect URL based on primary role
    // If user has multiple roles, redirect to highest priority (admin > designer > client)
    let redirectUrl = "/dashboard"
    if (result.allRoles?.includes("admin")) {
      redirectUrl = "/admin/dashboard"
    } else if (result.allRoles?.includes("designer")) {
      redirectUrl = "/designer/dashboard"
    } else {
      redirectUrl = "/dashboard"
    }

    if (!result.user) {
      return NextResponse.json(
        { error: "User data not available" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: "Login successful", 
        user: result.user,
        roles: result.allRoles || [result.user.role],
        redirect: redirectUrl
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Unified login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
