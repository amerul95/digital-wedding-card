import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || ""

async function getCurrentDesignerId() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("next-auth.session-token.designer")?.value

    if (!token || !JWT_SECRET) {
      return null
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.id as string

    const designer = await prisma.designer.findUnique({
      where: { userId },
      select: { id: true },
    })

    return designer?.id || null
  } catch (error) {
    console.error("Error getting current designer ID:", error)
    return null
  }
}

// Helper function to get first letter of theme name
function getThemeLetter(themeName: string): string {
  const themeMap: { [key: string]: string } = {
    'baby': 'B',
    'party': 'P',
    'ramadan': 'R',
    'raya': 'Y',
    'floral': 'F',
    'islamic': 'I',
    'minimalist': 'M',
    'modern': 'D',
    'rustic': 'S',
    'traditional': 'T',
    'vintage': 'V',
    'watercolor': 'W',
  }
  return themeMap[themeName.toLowerCase()] || themeName.charAt(0).toUpperCase()
}

// Helper function to get color code (first letter, use K for black)
function getColorCode(color: string): string {
  if (!color) return 'K'
  const upperColor = color.trim().toUpperCase()
  if (upperColor.includes('BLACK')) return 'K'
  return upperColor.charAt(0) || 'K'
}

// Helper function to format designer ID (pad to 3 digits)
async function formatDesignerId(designerId: string): Promise<string> {
  // Get designer to check creation order
  // We'll use a sequential number based on when designer was created
  const designer = await prisma.designer.findUnique({
    where: { id: designerId },
    select: { createdAt: true },
  })
  
  if (!designer) {
    // Fallback: use first 3 chars of ID
    return designerId.slice(0, 3).padStart(3, '0')
  }
  
  const designers = await prisma.designer.findMany({
    where: {
      createdAt: {
        lte: designer.createdAt
      }
    },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  })
  
  const index = designers.findIndex(d => d.id === designerId)
  // Return 1-indexed, padded to 3 digits (001, 002, etc.)
  return (index + 1).toString().padStart(3, '0')
}

// Helper function to get running number for a type
async function getNextRunningNumber(
  designerId: string,
  type: 'theme' | 'content' | 'template',
  themeName?: string
): Promise<number> {
  const whereClause: any = {
    designerId,
    configJson: { not: null },
  }

      // For theme type, also filter by themeName
      if (type === 'theme' && themeName) {
        // Find themes with the same themeName
        const themes = await prisma.theme.findMany({
          where: whereClause,
          select: { configJson: true },
        })

    // Parse configJson to check type
    const matchingThemes = themes.filter((t) => {
      if (!t.configJson) return false
      try {
        const config = JSON.parse(t.configJson)
        return config.type === 'theme'
      } catch {
        return false
      }
    })

        if (matchingThemes.length === 0) return 1
        
        // Get running numbers from configJson if not in DB yet
        const runningNumbers = matchingThemes.map((t) => {
          try {
            const cfg = JSON.parse(t.configJson || '{}')
            return cfg.runningNumber || 0
          } catch {
            return 0
          }
        })
        const maxRunning = Math.max(...runningNumbers, 0)
        return maxRunning + 1
      }

  // For content type
  if (type === 'content') {
    const contents = await prisma.theme.findMany({
      where: whereClause,
      select: { configJson: true },
    })

    const matchingContents = contents.filter((t) => {
      if (!t.configJson) return false
      try {
        const config = JSON.parse(t.configJson)
        return config.type === 'content'
      } catch {
        return false
      }
    })

    if (matchingContents.length === 0) return 1
    
    const runningNumbers = matchingContents.map((t) => {
      try {
        const cfg = JSON.parse(t.configJson || '{}')
        return cfg.runningNumber || 0
      } catch {
        return 0
      }
    })
    const maxRunning = Math.max(...runningNumbers, 0)
    return maxRunning + 1
  }

  // For template type
  if (type === 'template') {
    const templates = await prisma.theme.findMany({
      where: whereClause,
      select: { configJson: true },
    })

    const matchingTemplates = templates.filter((t) => {
      if (!t.configJson) return false
      try {
        const config = JSON.parse(t.configJson)
        return config.type === 'template'
      } catch {
        return false
      }
    })

    if (matchingTemplates.length === 0) return 1
    
    const runningNumbers = matchingTemplates.map((t) => {
      try {
        const cfg = JSON.parse(t.configJson || '{}')
        return cfg.runningNumber || 0
      } catch {
        return 0
      }
    })
    const maxRunning = Math.max(...runningNumbers, 0)
    return maxRunning + 1
  }

  return 1
}

// Helper function to generate custom ID
async function generateCustomId(
  designerId: string,
  type: 'theme' | 'content' | 'template',
  config?: any
): Promise<string> {
  const designerCode = await formatDesignerId(designerId)
  const runningNumber = await getNextRunningNumber(
    designerId,
    type,
    config?.themeName
  )
  const runningCode = runningNumber.toString().padStart(3, '0')

  if (type === 'theme') {
    const themeName = config?.themeName
    if (!themeName) {
      throw new Error('Theme name is required for theme type')
    }
    const themeLetter = getThemeLetter(themeName)
    return `${designerCode}-${themeLetter}-${runningCode}`
  }

  if (type === 'content') {
    return `${designerCode}-${runningCode}`
  }

  if (type === 'template') {
    const themeName = config?.themeName
    const color = config?.color
    const year = new Date().getFullYear().toString().slice(-2) // Last 2 digits

    if (!themeName) {
      throw new Error('Theme name is required for template type')
    }
    if (!color) {
      throw new Error('Color is required for template type')
    }

    const themeLetter = getThemeLetter(themeName)
    const colorCode = getColorCode(color)

    // Simplified template ID format: DesignerCode-ThemeLetter-Year-RunningNumber-ColorCode
    return `${designerCode}-${themeLetter}-${year}-${runningCode}-${colorCode}`
  }

  return `${designerCode}-${runningCode}`
}

export async function GET() {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Get all themes for this designer
    const themes = await prisma.theme.findMany({
      where: { designerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        isPublished: true,
        createdAt: true,
        previewImageUrl: true,
        configJson: true,
      },
    })

    // Get sales count and earnings for each theme
    const themesWithStats = await Promise.all(
      themes.map(async (theme) => {
        const sales = await prisma.themeSale.findMany({
          where: { themeId: theme.id, designerId },
        })

        const salesCount = sales.length
        const earnings = sales.reduce(
          (sum, sale) => sum + Number(sale.designerEarning),
          0
        )

        const config = theme.configJson ? JSON.parse(theme.configJson) : null
        const type = config?.type || 'theme' // Default to 'theme' for backward compatibility
        
        // Extract year from customId for templates (format: 001-F-001-24-001-R)
        let year: string | null = null
        if (type === 'template' && config?.customId) {
          const parts = config.customId.split('-')
          if (parts.length >= 4) {
            year = `20${parts[3]}` // Convert 24 to 2024
          }
        }

        return {
          id: theme.id,
          name: theme.name,
          status: theme.isPublished ? "published" : "draft",
          createdAt: theme.createdAt.toISOString(),
          sales: salesCount,
          earnings: earnings,
          previewImage: theme.previewImageUrl || null,
          config: config,
          editorData: config?.editorData || null, // Include editorData for preview rendering
          type: type, // 'theme', 'content', or 'template'
          customId: config?.customId || null,
          year: year, // Extract year for templates
        }
      })
    )

    return NextResponse.json(themesWithStats)
  } catch (error: any) {
    console.error("Error fetching themes:", error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const designerId = await getCurrentDesignerId()

  if (!designerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { name, config, defaultEventData, type = 'theme', isDuplicate = false, previewImageUrl } = body

    // For template type, validate required fields
    if (type === 'template') {
      if (!config?.themeName) {
        return NextResponse.json(
          { error: "Theme name is required for template" },
          { status: 400 }
        )
      }
      if (!config?.color) {
        return NextResponse.json(
          { error: "Color is required for template" },
          { status: 400 }
        )
      }
    }

    // Generate custom ID and running number for templates only
    const runningNumber = await getNextRunningNumber(designerId, type, config?.themeName)
    const customId = await generateCustomId(designerId, type, config)

    // Auto-generate name based on customId if not provided
    let generatedName: string
    if (name && typeof name === "string" && name.trim().length > 0) {
      generatedName = name.trim()
    } else {
      // Generate friendly name from ID format
      if (type === 'theme') {
        const themeName = config?.themeName || 'Theme'
        const themeDisplay = themeName.charAt(0).toUpperCase() + themeName.slice(1)
        generatedName = `${themeDisplay} Theme ${runningNumber.toString().padStart(3, '0')}`
      } else if (type === 'content') {
        generatedName = `Content ${runningNumber.toString().padStart(3, '0')}`
      } else {
        // template
        const themeName = config?.themeName || 'Theme'
        const themeDisplay = themeName.charAt(0).toUpperCase() + themeName.slice(1)
        generatedName = `${themeDisplay} Template ${runningNumber.toString().padStart(3, '0')}`
      }
    }

    // Merge config and defaultEventData into a single config object
    // Include type to distinguish between theme, content, and template
    const fullConfig = {
      ...config,
      defaultEventData: defaultEventData || null,
      type: type, // 'theme', 'content', or 'template'
    }

    // Create the theme (or content/template)
    const theme = await prisma.theme.create({
      data: {
        name: generatedName,
        designerId,
        configJson: JSON.stringify({
          ...fullConfig,
          customId,
          themeName: config?.themeName || null,
          color: config?.color || null,
          runningNumber,
        }),
        previewImageUrl: previewImageUrl || null, // Store thumbnail if provided
        isPublished: false, // Default to draft
      } as any,
    })

    // Parse config to get customId
    let parsedCustomId = customId
    try {
      const savedConfig = JSON.parse(theme.configJson || '{}')
      parsedCustomId = savedConfig.customId || customId
    } catch {
      // Keep default
    }

    return NextResponse.json(
      { 
        message: `${type === "theme" ? "Theme" : type === "content" ? "Content" : "Template"} created successfully`,
        theme: {
          id: theme.id,
          customId: parsedCustomId,
          name: theme.name,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating theme:", error)
    
    // Handle unique constraint violation (duplicate theme name)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A theme with this name or custom ID already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}

