import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth/helpers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    const result = await signIn("designer", email, password)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials" },
        { status: 401 }
      )
    }

    // Get redirect URL from query params if provided
    const url = new URL(req.url)
    const redirect = url.searchParams.get("redirect") || "/designer/dashboard"
    const decodedRedirect = redirect ? decodeURIComponent(redirect) : "/designer/dashboard"

    // Return success response with redirect URL
    // The cookie is already set by signIn function
    return NextResponse.json(
      { 
        message: "Login successful", 
        user: result.user,
        redirect: decodedRedirect
      },
      { 
        status: 200,
        headers: {
          // Ensure cookie is set by adding cache control
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


