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

    // Get or create admin role
    let adminRole = await prisma.role.findUnique({
      where: { name: "admin" }
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "admin" }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with admin role
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: adminRole.id, // Keep for backward compatibility
        roles: {
          create: {
            roleId: adminRole.id
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Admin account created successfully" },
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



