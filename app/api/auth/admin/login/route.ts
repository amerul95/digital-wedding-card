import { NextResponse } from "next/server"
import { signIn } from "@/lib/auth/helpers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    const result = await signIn("admin", email, password)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Invalid credentials" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Login successful", user: result.user },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

