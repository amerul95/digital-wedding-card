/**
 * Public API for Thumbnail Generation
 * 
 * This endpoint allows fetching template data without authentication
 * for the purpose of generating thumbnails server-side.
 * It's safe because it only returns template data (no sensitive info).
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> | { templateId: string } }
) {
  try {
    // Handle both sync and async params
    let templateId: string
    if (params && typeof params === 'object' && 'then' in params) {
      const resolved = await (params as Promise<{ templateId: string }>)
      templateId = resolved.templateId
    } else {
      templateId = (params as { templateId: string }).templateId
    }

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Fetch template - allow both published and unpublished for thumbnail generation
    const theme = await prisma.theme.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        name: true,
        configJson: true,
        isPublished: true,
      },
    })

    if (!theme) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Parse config to get editorData
    let config
    try {
      config = JSON.parse(theme.configJson || '{}')
    } catch {
      return NextResponse.json(
        { error: 'Invalid template config' },
        { status: 400 }
      )
    }

    const editorData = config.editorData

    if (!editorData) {
      return NextResponse.json(
        { error: 'Template has no editor data' },
        { status: 400 }
      )
    }

    // Return editorData for rendering
    return NextResponse.json({
      success: true,
      editorData: editorData,
      template: {
        id: theme.id,
        name: theme.name,
        isPublished: theme.isPublished,
      },
    })
  } catch (error: any) {
    console.error('[ThumbnailTemplateAPI] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
