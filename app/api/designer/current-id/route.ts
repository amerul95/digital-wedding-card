import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("next-auth.session-token.designer")?.value;

    if (!token || !JWT_SECRET) {
      return NextResponse.json({ designerId: null });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const designer = await prisma.designer.findUnique({
      where: { userId },
      select: { id: true },
    });

    return NextResponse.json({ designerId: designer?.id || null });
  } catch (error) {
    console.error("Error getting current designer ID:", error);
    return NextResponse.json({ designerId: null });
  }
}
