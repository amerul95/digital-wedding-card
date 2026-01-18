import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get all published templates
    const themes = await prisma.theme.findMany({
      where: {
        isPublished: true,
      },
      include: {
        designer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter and format templates
    const templates = themes
      .map((theme) => {
        const config = theme.configJson ? JSON.parse(theme.configJson) : null;
        const type = config?.type || 'theme';
        
        // Only return templates (not themes or content)
        if (type !== 'template') {
          return null;
        }

        // Extract year from customId (format: 001-F-001-24-001-R)
        let year: string | null = null;
        if (config?.customId) {
          const parts = config.customId.split('-');
          if (parts.length >= 4) {
            year = `20${parts[3]}`; // Convert 24 to 2024
          }
        }

        return {
          id: theme.id,
          designName: theme.name,
          designerName: theme.designer?.user?.email || "Unknown Designer",
          isFavourited: false, // TODO: Check if user has favourited this
          year: year,
          previewImage: theme.previewImageUrl || null,
        };
      })
      .filter((template) => template !== null);

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
