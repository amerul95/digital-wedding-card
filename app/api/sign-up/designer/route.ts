import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SchemaSignUpForm = z.object({
  fullName: z.string().min(2, {
    message: "Full name is required"
  }),
  email: z.string().email({ message: "Please enter valid email" }).min(2, {
    message: "email is required"
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters"
  }),
  address: z.string().min(5, {
    message: "Address is required"
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

    const { fullName, email, password, address } = parsed.data

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
        roleId: designerRole.id, // Keep for backward compatibility
        roles: {
          create: {
            roleId: designerRole.id
          }
        }
      }
    })

    // Create designer profile
    await prisma.designer.create({
      data: {
        userId: user.id,
        name: fullName,
        address: address
      }
    })

    return NextResponse.json(
      { message: "Designer account created successfully" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Designer sign-up error:", error)
    
    // Provide more specific error messages
    if (error?.code === "P2038") {
      const databaseUrl = process.env.DATABASE_URL || ''
      const isUsingAccelerate = databaseUrl.startsWith('prisma://')
      
      return NextResponse.json(
        { 
          error: isUsingAccelerate 
            ? "Prisma Accelerate doesn't support ALTER statements. Please change your DATABASE_URL to use a direct PostgreSQL connection (e.g., postgresql://postgres:postgres@localhost:5433/wedding_app?schema=public) instead of prisma:// URL."
            : "Database schema needs to be migrated. Please run 'prisma migrate dev' or 'prisma db push' to sync the database schema."
        },
        { status: 500 }
      )
    }
    
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}


