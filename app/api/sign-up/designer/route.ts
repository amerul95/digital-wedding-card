import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SchemaSignUpForm = z.object({
  email: z.string().email({ message: "Please enter valid email" }).min(2, {
    message: "email is required"
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters"
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = SchemaSignUpForm.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      )
    }

    // Get or create designer role
    let designerRole = await prisma.role.findUnique({
      where: { name: "designer" }
    })

    if (!designerRole) {
      designerRole = await prisma.role.create({
        data: { name: "designer" }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with designer role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: designerRole.id
      }
    })

    // Create designer profile
    await prisma.designer.create({
      data: {
        userId: user.id
      }
    })

    return NextResponse.json(
      { message: "Designer account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

