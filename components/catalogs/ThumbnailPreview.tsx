'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/components/editor/store'
import { NodeRenderer } from '@/components/editor/NodeRenderer'
import { PreviewProvider } from '@/components/editor/context/PreviewContext'
import Image from 'next/image'

interface ThumbnailPreviewProps {
  templateId?: string
  previewImageUrl?: string | null
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
  width = 118,
  height = 237,
  className = ''
}: ThumbnailPreviewProps) {
  const [isLoading, setIsLoading] = useState(!previewImageUrl)
  const [shouldRenderFallback, setShouldRenderFallback] = useState(!previewImageUrl)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodes = useEditorStore((state) => state.nodes)
  const rootId = useEditorStore((state) => state.rootId)

  // Load template data if previewImageUrl is missing and templateId is provided
  useEffect(() => {
    if (!previewImageUrl && templateId && shouldRenderFallback) {
      // Load template from API if needed
      const loadTemplate = async () => {
        try {
          const response = await fetch(`/api/catalog/templates/${templateId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.editorData) {
              // Hydrate the store with template data
              useEditorStore.setState({
                nodes: data.editorData.nodes || {},
                rootId: data.editorData.rootId || 'root',
                globalSettings: data.editorData.globalSettings || {},
                viewOptions: { ...data.editorData.viewOptions, showDoorOverlay: false }
              })
            }
          }
        } catch (error) {
          console.error('[ThumbnailPreview] Error loading template:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadTemplate()
    } else {
      setIsLoading(false)
    }
  }, [templateId, previewImageUrl, shouldRenderFallback])

  // Find first section (excluding door) for fallback rendering
  const rootNode = rootId ? nodes[rootId] : null
  const firstSectionId = rootNode?.children?.find((childId) => {
    const child = nodes[childId]
    return child && child.type === 'section'
  })

  // If we have a preview image, use it
  if (previewImageUrl && !shouldRenderFallback) {
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

  // Fallback: Render first section
  if (shouldRenderFallback && !isLoading && firstSectionId) {
    return (
      <PreviewProvider>
        <div
          ref={containerRef}
          className={`relative bg-white overflow-hidden rounded-lg ${className}`}
          style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            transform: `scale(${width / 375})`,
            transformOrigin: 'top left'
          }}
        >
          <NodeRenderer nodeId={firstSectionId} />
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
