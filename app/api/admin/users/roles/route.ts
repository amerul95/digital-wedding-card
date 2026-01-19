import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const ROOT_ADMIN_EMAIL = "mirolesuperman@gmail.com"

const assignRolesSchema = z.object({
  userId: z.string().uuid(),
  roleNames: z.array(z.enum(["admin", "designer", "client"])).min(1)
})

// Assign multiple roles to a user
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = assignRolesSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { userId, roleNames } = parsed.data

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent role removal from root admin
    if (user.email === ROOT_ADMIN_EMAIL) {
      // Ensure admin role is always present
      if (!roleNames.includes("admin")) {
        return NextResponse.json(
          { error: "Cannot remove admin role from root admin user" },
          { status: 403 }
        )
      }
    }

    // Get all role IDs
    const roles = await prisma.role.findMany({
      where: {
        name: { in: roleNames }
      }
    })

    if (roles.length !== roleNames.length) {
      return NextResponse.json(
        { error: "One or more roles not found" },
        { status: 404 }
      )
    }

    // Delete existing roles for this user
    await prisma.userRole.deleteMany({
      where: { userId }
    })

    // Create new role assignments
    await prisma.userRole.createMany({
      data: roles.map(role => ({
        userId,
        roleId: role.id
      })),
      skipDuplicates: true
    })

    // Update primary roleId for backward compatibility (use first role or admin if available)
    const primaryRole = roles.find(r => r.name === "admin") || roles[0]
    await prisma.user.update({
      where: { id: userId },
      data: { roleId: primaryRole.id }
    })

    return NextResponse.json(
      { 
        message: "Roles assigned successfully",
        roles: roleNames
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Assign roles error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get user roles
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        role: true // Backward compatibility
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get all roles from UserRole table
    const userRoles = user.roles.map(ur => ur.role.name)
    
    // Fallback to old roleId if no roles in UserRole table
    const allRoles = userRoles.length > 0 
      ? userRoles 
      : (user.role?.name ? [user.role.name] : ["client"])

    return NextResponse.json(
      { 
        userId: user.id,
        email: user.email,
        roles: allRoles
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Get user roles error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
