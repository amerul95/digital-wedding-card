/**
 * Thumbnail Generation API
 * 
 * Generates a server-side screenshot of a template using Playwright.
 * Saves the thumbnail to local storage (or S3 in production).
 */

import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { getCurrentDesignerId } from '@/lib/auth/helpers'
import { saveThumbnail } from '@/lib/storage/thumbnailStorage'
import { prisma } from '@/lib/prisma'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    // Authenticate designer
    const designerId = await getCurrentDesignerId()
    if (!designerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { templateId } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      )
    }

    // Verify template exists and belongs to designer
    const theme = await prisma.theme.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        designerId: true,
        configJson: true,
      },
    })

    if (!theme) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    if (theme.designerId !== designerId) {
      return NextResponse.json(
        { error: 'Unauthorized - template does not belong to you' },
        { status: 403 }
      )
    }

    // Get base URL for preview route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const previewUrl = `${baseUrl}/api/thumbnail/preview/${templateId}`

    console.log('[ThumbnailGenerate] Starting screenshot generation for:', templateId)
    console.log('[ThumbnailGenerate] Preview URL:', previewUrl)

    // Launch Playwright browser
    const browser = await chromium.launch({
      headless: true,
    })

    try {
      const page = await browser.newPage({
        viewport: { width: 375, height: 667 },
      })

      // Navigate to preview page
      await page.goto(previewUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      })

      // Wait for content to render (give React time to hydrate)
      await page.waitForTimeout(2000)

      // Wait for any images to load
      await page.waitForLoadState('networkidle')

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 375,
          height: 667,
        },
      })

      // Generate filename
      const filename = `template-${templateId}-${Date.now()}.png`

      // Save thumbnail
      const thumbnailUrl = await saveThumbnail(screenshotBuffer as Buffer, filename)

      console.log('[ThumbnailGenerate] Thumbnail saved:', thumbnailUrl)

      // Update template with new thumbnail URL
      await prisma.theme.update({
        where: { id: templateId },
        data: {
          previewImageUrl: thumbnailUrl,
        },
      })

      return NextResponse.json({
        success: true,
        thumbnailUrl,
        message: 'Thumbnail generated successfully',
      })
    } finally {
      await browser.close()
    }
  } catch (error: any) {
    console.error('[ThumbnailGenerate] Error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate thumbnail',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
