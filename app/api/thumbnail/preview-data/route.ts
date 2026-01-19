/**
 * Preview Route with Editor Data
 * 
 * This route accepts editorData in the request and renders it for screenshot.
 * Used for generating thumbnails for new templates before they're saved.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { editorData } = body

    if (!editorData) {
      return new NextResponse('editorData is required', { status: 400 })
    }

    // Return HTML page that will be rendered by Playwright
    // The page will use the editorData to render the template
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Template Preview</title>
  <script>
    // Store template data in a script tag for the page to read
    window.__EDITOR_DATA__ = ${JSON.stringify(editorData)};
  </script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 375px;
      height: 667px;
      overflow: hidden;
      background: white;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="__next"></div>
  <script>
    // This will be handled by the preview page component
    // The page will read window.__EDITOR_DATA__ and render it
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error: any) {
    console.error('[ThumbnailPreviewData] Error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
