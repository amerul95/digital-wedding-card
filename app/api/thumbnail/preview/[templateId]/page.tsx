/**
 * Thumbnail Preview Page
 * 
 * This is a minimal page specifically designed for Playwright screenshots.
 * It renders only the first section of the template without any UI chrome.
 */

'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/components/editor/store'
import { NodeRenderer } from '@/components/editor/NodeRenderer'
import { PreviewProvider } from '@/components/editor/context/PreviewContext'
import axios from 'axios'

export default function ThumbnailPreviewPage({ params }: { params: Promise<{ templateId: string }> | { templateId: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templateId, setTemplateId] = useState<string | null>(null)

  // CRITICAL: All hooks must be called before any conditional returns
  // This ensures hooks are called in the same order on every render
  const nodes = useEditorStore((state) => state.nodes)
  const rootId = useEditorStore((state) => state.rootId)
  const rootNode = rootId ? nodes[rootId] : null

  // Find first section (excluding door) - calculate this before early returns
  const firstSectionId = rootNode?.children?.find((childId: string) => {
    const child = nodes[childId]
    return child && child.type === 'section'
  })

  // Handle both sync and async params (Next.js 13+ vs 15+)
  useEffect(() => {
    if (params && typeof params === 'object' && 'then' in params) {
      // Async params (Next.js 15+)
      (params as Promise<{ templateId: string }>).then(resolved => {
        setTemplateId(resolved.templateId)
      })
    } else {
      // Sync params (Next.js 13-14)
      setTemplateId((params as { templateId: string }).templateId)
    }
  }, [params])

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Use the public thumbnail API endpoint (no auth required)
        const response = await axios.get(`/api/thumbnail/template/${templateId}`)

        if (response.data?.success && response.data?.editorData) {
          const editorData = response.data.editorData
          
          // Hydrate the store
          useEditorStore.setState({
            nodes: editorData.nodes || {},
            rootId: editorData.rootId || 'root',
            selectedId: null,
            globalSettings: editorData.globalSettings || {},
            viewOptions: { ...editorData.viewOptions, showDoorOverlay: false },
          })
        } else {
          setError('Template has no editor data')
        }
      } catch (err: any) {
        console.error('Error loading template:', err)
        setError(err.response?.data?.error || err.message || 'Failed to load template')
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      loadTemplate()
    }
  }, [templateId])
  
  // Now we can do conditional returns AFTER all hooks have been called
  if (!templateId) {
    return (
      <div style={{ width: '375px', height: '667px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ width: '375px', height: '667px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error || !firstSectionId) {
    return (
      <div style={{ width: '375px', height: '667px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: 'red' }}>
        <div>{error || 'No section found'}</div>
      </div>
    )
  }

  return (
    <PreviewProvider isPreview={true}>
      <div
        style={{
          width: '375px',
          height: '667px',
          position: 'relative',
          overflow: 'hidden',
          background: 'white',
        }}
      >
        <NodeRenderer nodeId={firstSectionId} />
      </div>
    </PreviewProvider>
  )
}
