import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const theme = await prisma.theme.findFirst({
      where: {
        id,
        isPublished: true,
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
