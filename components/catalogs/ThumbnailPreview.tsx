'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useEditorStore } from '@/components/editor/store'
import { NodeRenderer } from '@/components/editor/NodeRenderer'
import { PreviewProvider } from '@/components/editor/context/PreviewContext'
import Image from 'next/image'

interface ThumbnailPreviewProps {
  templateId?: string
  previewImageUrl?: string | null
  editorData?: any | null
  width?: number
  height?: number
  className?: string
}

/**
 * ThumbnailPreview Component
 * 
 * Shows thumbnail for catalog cards with fallback:
 * 1. If previewImageUrl exists, show the stored thumbnail image
 * 2. Otherwise, render the first section on-demand (excluding door)
 */
export function ThumbnailPreview({
  templateId,
  previewImageUrl,
  editorData,
  width = 118,
  height = 237,
  className = ''
}: ThumbnailPreviewProps) {
  // If editorData is available, prefer rendering the section over preview image
  // This ensures we show the actual current state with correct background colors
  const preferRenderOverImage = !!editorData
  
  const [isLoading, setIsLoading] = useState(!previewImageUrl && !editorData)
  // When editorData is available, always render the section (ignore preview image)
  const [shouldRenderFallback, setShouldRenderFallback] = useState(!previewImageUrl || preferRenderOverImage)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use local state for nodes to avoid conflicts between multiple thumbnail instances
  // Each thumbnail should use its own editorData, not the global store
  const [localNodes, setLocalNodes] = useState<Record<string, any>>({})
  const [localRootId, setLocalRootId] = useState<string>('root')
  
  // Use a ref to track the current templateId being rendered
  const currentTemplateIdRef = useRef<string | undefined>(templateId)
  
  // Update the store only if this is the current template being rendered
  // This prevents multiple thumbnails from overwriting each other's data
  const nodes = useMemo(() => {
    if (Object.keys(localNodes).length > 0 && currentTemplateIdRef.current === templateId) {
      return localNodes
    }
    return useEditorStore.getState().nodes
  }, [localNodes, templateId])
  
  const rootId = useMemo(() => {
    if (Object.keys(localNodes).length > 0 && currentTemplateIdRef.current === templateId) {
      return localRootId
    }
    return useEditorStore.getState().rootId
  }, [localNodes, localRootId, templateId])

  // Always log when component renders - use console.warn to make it more visible
  console.warn('🔍 [ThumbnailPreview] Component rendered:', {
    templateId,
    previewImageUrl: previewImageUrl ? previewImageUrl.substring(0, 50) + '...' : null,
    hasPreviewImage: !!previewImageUrl,
    hasEditorData: !!editorData,
    isLoading,
    shouldRenderFallback,
    nodeCount: Object.keys(nodes).length,
    rootId
  })

  // Load editorData into local state (not global store) to avoid conflicts between thumbnails
  // When editorData is available, prefer rendering over preview image to show accurate colors
  useEffect(() => {
    if (editorData) {
      // Set this template as the current one being rendered
      currentTemplateIdRef.current = templateId
      
      const firstSection = Object.values(editorData.nodes || {}).find((n: any) => n.type === 'section') as any
      const firstSectionBgColor = firstSection?.style?.backgroundColor
      console.warn('📦 [ThumbnailPreview] Loading editorData for template:', templateId, {
        hasNodes: !!editorData.nodes,
        nodeCount: Object.keys(editorData.nodes || {}).length,
        rootId: editorData.rootId,
        firstSection: firstSection,
        firstSectionBgColor: firstSectionBgColor
      })
      
      // Store in local state instead of global store to avoid conflicts
      setLocalNodes(editorData.nodes || {})
      setLocalRootId(editorData.rootId || 'root')
      
      // Update the store for NodeRenderer (it uses the global store)
      // This ensures NodeRenderer has access to the correct nodes for this template
      useEditorStore.setState({
        nodes: editorData.nodes || {},
        rootId: editorData.rootId || 'root',
        globalSettings: editorData.globalSettings || {},
        viewOptions: { ...editorData.viewOptions, showDoorOverlay: false }
      })
      
      // When editorData is available, always prefer rendering over preview image
      setShouldRenderFallback(true)
      setIsLoading(false)
    }
  }, [editorData, templateId])

  // Load template data from API if previewImageUrl is missing and editorData not provided
  useEffect(() => {
    if (!previewImageUrl && !editorData && templateId && shouldRenderFallback) {
      // Load template from API if needed
      // Try designer API first (for unpublished templates), then catalog API
      const loadTemplate = async () => {
        try {
          // Try designer API first (works for both published and unpublished)
          let response = await fetch(`/api/designer/themes/${templateId}`)
          if (!response.ok) {
            // Fallback to catalog API (only published templates)
            response = await fetch(`/api/catalog/templates/${templateId}`)
          }
          
          if (response.ok) {
            const data = await response.json()
            const loadedEditorData = data.editorData || data.config?.editorData
            if (loadedEditorData) {
              // Store in local state instead of global store to avoid conflicts
              setLocalNodes(loadedEditorData.nodes || {})
              setLocalRootId(loadedEditorData.rootId || 'root')
            }
          }
        } catch (error) {
          console.error('[ThumbnailPreview] Error loading template:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadTemplate()
    } else if (previewImageUrl || editorData) {
      setIsLoading(false)
    }
  }, [templateId, previewImageUrl, editorData, shouldRenderFallback])

  // Find first section (excluding door) for fallback rendering
  const rootNode = rootId ? nodes[rootId] : null
  const firstSectionId = rootNode?.children?.find((childId: string) => {
    const child = nodes[childId]
    return child && child.type === 'section'
  })
  
  // Debug: Log section info
  useEffect(() => {
    if (firstSectionId && shouldRenderFallback) {
      const sectionNode = nodes[firstSectionId]
      console.log('[ThumbnailPreview] First section found:', {
        firstSectionId,
        sectionNode,
        style: sectionNode?.style,
        backgroundColor: sectionNode?.style?.backgroundColor
      })
    }
  }, [firstSectionId, shouldRenderFallback, nodes])

  // If we have a preview image and editorData is NOT available, use it
  // Otherwise, prefer rendering the section to show accurate background colors
  if (previewImageUrl && !shouldRenderFallback && !preferRenderOverImage) {
    console.warn('🖼️ [ThumbnailPreview] Using preview image:', previewImageUrl.substring(0, 50))
    // Use regular img tag for data URLs (base64), Image component for regular URLs
    const isDataUrl = previewImageUrl.startsWith('data:')
    
    return (
      <div 
        className={`relative ${className} overflow-hidden rounded-lg`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {isDataUrl ? (
          <img
            src={previewImageUrl}
            alt="Card preview"
            className="w-full h-full object-cover"
            onError={() => {
              // Fallback to rendering if image fails to load
              setShouldRenderFallback(true)
            }}
          />
        ) : (
          <Image
            src={previewImageUrl}
            alt="Card preview"
            fill
            className="object-cover rounded-lg"
            onError={() => {
              // Fallback to rendering if image fails to load
              setShouldRenderFallback(true)
            }}
          />
        )}
      </div>
    )
  }

  // Effect to override SectionWidget's bg-white class and ensure proper rendering
  // This handles both background colors and ensures background images are visible
  useEffect(() => {
    if (!shouldRenderFallback || isLoading || !firstSectionId) return
    
    const sectionNode = nodes[firstSectionId]
    if (!sectionNode) {
      console.warn('[ThumbnailPreview] Section node not found:', firstSectionId)
      return
    }
    
    const sectionStyle = sectionNode.style || {}
    const sectionBgColor = sectionStyle.backgroundColor
    const hasBackgroundImage = sectionStyle.backgroundImage
    
    console.warn('🔍 [ThumbnailPreview] Checking section background:', {
      templateId,
      firstSectionId,
      sectionNode: sectionNode ? 'exists' : 'missing',
      sectionStyle: Object.keys(sectionStyle),
      backgroundColor: sectionBgColor,
      hasBackgroundImage,
      backgroundImage: hasBackgroundImage ? sectionStyle.backgroundImage?.substring(0, 50) + '...' : null,
      hasChildren: sectionNode?.children?.length > 0,
      childrenCount: sectionNode?.children?.length || 0,
      hasContainer: !!containerRef.current
    })
    
    // Wait a bit for the section to render, then find and override
    const timeout = setTimeout(() => {
      const sectionElement = containerRef.current?.querySelector(`[data-section-id="${firstSectionId}"]`) as HTMLElement
      console.warn('🎯 [ThumbnailPreview] Found section element:', {
        templateId,
        found: !!sectionElement,
        element: sectionElement,
        backgroundColor: sectionBgColor,
        hasBackgroundImage,
        computedBg: sectionElement ? window.getComputedStyle(sectionElement).backgroundColor : null,
        computedBgImage: sectionElement ? window.getComputedStyle(sectionElement).backgroundImage : null
      })
      
      if (sectionElement) {
        // Force the section to have a fixed height that fits in the thumbnail
        // This prevents it from being 100vh which would be cut off
        const scaledHeight = height / (width / 375)
        sectionElement.style.height = `${scaledHeight}px`
        sectionElement.style.minHeight = `${scaledHeight}px`
        sectionElement.style.maxHeight = `${scaledHeight}px`
        // Use overflow visible to ensure content renders, clip at container level
        sectionElement.style.overflow = 'visible'
        
        // Find all text widgets inside and ensure their styles are applied correctly
        // Look for elements with prose class (TextWidget inner div)
        const textElements = sectionElement.querySelectorAll('.prose')
        console.warn('📝 [ThumbnailPreview] Found text elements:', textElements.length)
        
        textElements.forEach((textEl: any, index: number) => {
          // Get the parent element which should have the style prop from TextWidget
          const parentEl = textEl.parentElement
          if (parentEl) {
            // Get inline styles from parent (these come from the style prop)
            const parentInlineStyle = parentEl.getAttribute('style') || ''
            const parentComputedStyle = window.getComputedStyle(parentEl)
            
            // Extract color and textAlign from inline style or computed style
            let textColor = parentEl.style.color || parentComputedStyle.color
            let textAlign = parentEl.style.textAlign || parentComputedStyle.textAlign
            
            // Also check if styles are in the style attribute string
            const colorMatch = parentInlineStyle.match(/color:\s*([^;]+)/i)
            const alignMatch = parentInlineStyle.match(/text-align:\s*([^;]+)/i)
            
            if (colorMatch) textColor = colorMatch[1].trim()
            if (alignMatch) textAlign = alignMatch[1].trim()
            
            console.warn(`📝 [ThumbnailPreview] Text element ${index}:`, {
              textContent: textEl.textContent?.substring(0, 20),
              parentInlineStyle: parentInlineStyle.substring(0, 100),
              textColor,
              textAlign,
              computedColor: parentComputedStyle.color,
              computedAlign: parentComputedStyle.textAlign
            })
            
            // Apply styles to the inner text div with !important to override prose class
            if (textColor && textColor !== 'rgb(0, 0, 0)' && textColor !== 'rgb(0, 0, 0)' && textColor !== 'black' && textColor !== '#000000') {
              textEl.style.setProperty('color', textColor, 'important')
              // Also apply to all child elements (p tags, etc.)
              textEl.querySelectorAll('*').forEach((child: any) => {
                child.style.setProperty('color', textColor, 'important')
              })
            }
            if (textAlign && textAlign !== 'left' && textAlign !== 'start') {
              textEl.style.setProperty('text-align', textAlign, 'important')
              // Also apply to all child elements
              textEl.querySelectorAll('*').forEach((child: any) => {
                child.style.setProperty('text-align', textAlign, 'important')
              })
            }
          }
          
          // Ensure text elements can display full content
          textEl.style.overflow = 'visible'
          textEl.style.textOverflow = 'clip'
          textEl.style.whiteSpace = 'pre-wrap'
          textEl.style.wordWrap = 'break-word'
          textEl.style.maxWidth = '100%'
          textEl.style.width = '100%'
        })
        
        // Also check for any elements that might be cutting off text
        const allElements = sectionElement.querySelectorAll('*')
        allElements.forEach((el: any) => {
          const computedStyle = window.getComputedStyle(el)
          // If an element has overflow hidden and might be cutting text, make it visible
          if (computedStyle.overflow === 'hidden' && el.textContent && el.textContent.trim().length > 0) {
            // Only change if it's not the section itself
            if (el !== sectionElement) {
              el.style.overflow = 'visible'
            }
          }
        })
        
        // If there's a background image, ensure it's visible
        if (hasBackgroundImage) {
          // SectionWidget should already have the background image set
          // Just ensure the bg-white class doesn't override it
          sectionElement.classList.remove('bg-white')
          // Ensure background image is applied
          if (sectionStyle.backgroundImage) {
            sectionElement.style.setProperty('background-image', `url(${sectionStyle.backgroundImage})`, 'important')
            sectionElement.style.setProperty('background-size', 'cover', 'important')
            sectionElement.style.setProperty('background-position', 'center', 'important')
            sectionElement.style.setProperty('background-repeat', 'no-repeat', 'important')
          }
          console.warn('🖼️ [ThumbnailPreview] Applied background image')
        } else if (sectionBgColor) {
          // Override the bg-white class by setting inline style with !important
          sectionElement.style.setProperty('background-color', sectionBgColor, 'important')
          console.warn('🎨 [ThumbnailPreview] Applied background color:', sectionBgColor)
        }
      } else {
        console.warn('❌ [ThumbnailPreview] Section element not found in DOM')
      }
    }, 200)
    
    return () => clearTimeout(timeout)
  }, [shouldRenderFallback, isLoading, firstSectionId, nodes, templateId, width, height])

  // Fallback: Render first section
  if (shouldRenderFallback && !isLoading && firstSectionId) {
    // Ensure the store has the correct nodes for this template before rendering
    // This is critical when multiple thumbnails render simultaneously
    if (Object.keys(localNodes).length > 0 && currentTemplateIdRef.current === templateId) {
      useEditorStore.setState({
        nodes: localNodes,
        rootId: localRootId
      })
    }
    
    // Get the section node to check its background properties
    const sectionNode = nodes[firstSectionId]
    const sectionStyle = sectionNode?.style || {}
    
    // Extract background properties from style
    // SectionWidget handles backgroundImage, gradient, and backgroundColor
    const sectionBgColor = sectionStyle.backgroundColor
    const hasBackgroundImage = sectionStyle.backgroundImage
    const hasGradient = sectionStyle.gradientType === 'linear' && sectionStyle.gradientColor1 && sectionStyle.gradientColor2
    
    // Container background: only use solid color if no image/gradient
    // Background images and gradients are handled by SectionWidget itself
    const containerBgColor = (!hasBackgroundImage && !hasGradient && sectionBgColor) 
      ? sectionBgColor 
      : 'transparent'
    
    console.warn('🎨 [ThumbnailPreview] Rendering fallback section:', {
      firstSectionId,
      sectionNode: sectionNode ? 'exists' : 'missing',
      sectionStyle: Object.keys(sectionStyle),
      sectionBgColor,
      hasBackgroundImage,
      backgroundImageUrl: hasBackgroundImage ? sectionStyle.backgroundImage?.substring(0, 50) + '...' : null,
      hasGradient,
      containerBgColor,
      hasChildren: sectionNode?.children?.length > 0,
      childrenCount: sectionNode?.children?.length || 0
    })
    
    // Calculate the scale factor and actual dimensions
    const scale = width / 375
    const scaledHeight = height / scale
    
    return (
      <PreviewProvider>
        <div
          ref={containerRef}
          className={`relative rounded-lg ${className}`}
          style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            overflow: 'hidden', // Clip at the container level, not during scaling
            // Only apply solid background color if no image/gradient
            // Background images are handled by SectionWidget
            backgroundColor: containerBgColor || 'transparent'
          }}
        >
          {/* Wrapper with proper scaling - section renders at full size then scales down */}
          {/* This ensures all content (text, images, backgrounds) are visible */}
          <div style={{ 
            width: '375px', 
            height: `${scaledHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'relative',
            // Don't set background here - let SectionWidget handle it
            backgroundColor: 'transparent',
            // Ensure text and content are not clipped during scaling
            overflow: 'visible'
          }}>
            {/* Render section with fixed height to fit in thumbnail */}
            {/* Use overflow: visible initially to ensure all content renders, then clip */}
            <div style={{
              width: '375px',
              height: `${scaledHeight}px`,
              overflow: 'visible', // Changed from 'hidden' to 'visible' to ensure content renders
              position: 'relative'
            }}>
              <NodeRenderer nodeId={firstSectionId} />
            </div>
          </div>
        </div>
      </PreviewProvider>
    )
  }

  // Loading or empty state
  return (
    <div
      className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <div className="text-gray-400 text-xs">No preview</div>
      )}
    </div>
  )
}
