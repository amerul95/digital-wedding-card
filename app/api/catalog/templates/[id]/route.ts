import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

async function isAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("next-auth.session-token.admin")?.value;

    if (!token || !JWT_SECRET) {
      return false;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    return user?.role?.name === "admin";
  } catch {
    return false;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminAccess = await isAdmin();

    // Admins can view any template (published or unpublished), regular users only published
    const theme = await prisma.theme.findFirst({
      where: {
        id,
        ...(adminAccess ? {} : { isPublished: true }),
      },
      select: {
        id: true,
        name: true,
        configJson: true,
      },
    });

    if (!theme) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const config = theme.configJson ? JSON.parse(theme.configJson) : null;

    // Check if it's a template type
    if (config?.type !== 'template') {
      return NextResponse.json(
        { error: "Not a valid template" },
        { status: 400 }
      );
    }

    // Return template data including editor nodes if available
    return NextResponse.json({
      id: theme.id,
      name: theme.name,
      config: config,
      // If template has editor data, include it
      editorData: config?.editorData || null,
    });
  } catch (error: any) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
