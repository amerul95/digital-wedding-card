/**
 * Thumbnail Preview Page with Data
 * 
 * This page reads editorData from window.__EDITOR_DATA__ and renders it.
 * Used for generating thumbnails for new templates.
 */

'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/components/editor/store'
import { NodeRenderer } from '@/components/editor/NodeRenderer'
import { PreviewProvider } from '@/components/editor/context/PreviewContext'

export default function ThumbnailPreviewDataPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Read editorData from window (set by the route)
    const editorData = (window as any).__EDITOR_DATA__

    if (!editorData) {
      setError('No editor data found')
      setLoading(false)
      return
    }

    try {
      // Hydrate the store
      useEditorStore.setState({
        nodes: editorData.nodes || {},
        rootId: editorData.rootId || 'root',
        selectedId: null,
        globalSettings: editorData.globalSettings || {},
        viewOptions: { ...editorData.viewOptions, showDoorOverlay: false },
      })
      setLoading(false)
    } catch (err: any) {
      console.error('Error loading editor data:', err)
      setError(err.message || 'Failed to load editor data')
      setLoading(false)
    }
  }, [])

  const nodes = useEditorStore((state) => state.nodes)
  const rootId = useEditorStore((state) => state.rootId)
  const rootNode = rootId ? nodes[rootId] : null

  // Find first section (excluding door)
  const firstSectionId = rootNode?.children?.find((childId: string) => {
    const child = nodes[childId]
    return child && child.type === 'section'
  })

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
