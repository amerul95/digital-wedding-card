# Thumbnail Generation Setup (Option A - Server-Side Screenshots)

This document explains the server-side thumbnail generation system using Playwright.

## How It Works

1. **When you save a template:**
   - For **new templates**: Uses client-side `html2canvas` (existing method)
   - For **existing templates**: Tries server-side Playwright first, falls back to `html2canvas` if it fails
   - After saving a new template, it automatically regenerates the thumbnail server-side for better quality

2. **Server-Side Process:**
   - Playwright launches a headless Chromium browser
   - Navigates to `/api/thumbnail/preview/[templateId]`
   - Waits for the page to fully render (including images and fonts)
   - Takes a screenshot at 375x667px (mobile card size)
   - Saves the image to `public/thumbnails/` (local) or S3 (production)

## Current Storage: Local File System

Thumbnails are currently saved to: `public/thumbnails/`

- Files are accessible at: `/thumbnails/filename.png`
- The directory is automatically created on first use
- Files are named: `template-{templateId}-{timestamp}.png`

## Switching to S3/Cloud Storage (Production)

To switch to cloud storage, update `lib/storage/thumbnailStorage.ts`:

1. Set environment variable: `THUMBNAIL_STORAGE_TYPE=s3`
2. Add S3 credentials to `.env`:
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   S3_BUCKET_NAME=your_bucket
   AWS_REGION=us-east-1
   ```
3. Uncomment and implement the S3 code in `saveThumbnail()` function
4. Install AWS SDK: `npm install @aws-sdk/client-s3`

## API Endpoints

### POST `/api/thumbnail/generate`
Generates a server-side screenshot of a template.

**Request:**
```json
{
  "templateId": "template-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "thumbnailUrl": "/thumbnails/template-123-1234567890.png",
  "message": "Thumbnail generated successfully"
}
```

### GET `/api/thumbnail/preview/[templateId]`
Preview page used by Playwright for screenshots. Renders the first section of the template.

## Testing

1. Save a template in the editor
2. Check `public/thumbnails/` directory for the generated image
3. Verify the thumbnail appears correctly in `/designer/dashboard/themes`

## Troubleshooting

- **Playwright not found**: Run `npx playwright install chromium`
- **Screenshot is blank**: Check if the preview page loads correctly in browser
- **Fonts not rendering**: Ensure fonts are loaded before screenshot (Playwright waits for networkidle)
- **Images not showing**: Check CORS settings and image URLs

## Performance Notes

- Server-side generation takes 2-5 seconds
- Thumbnails are cached (same templateId = same thumbnail until template is updated)
- Consider adding a background job queue for production (e.g., Bull, BullMQ)
