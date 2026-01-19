'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Layout, Globe, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { ThumbnailPreview } from '@/components/catalogs/ThumbnailPreview'

interface Theme {
  id: string
  name: string
  status: 'published' | 'draft'
  createdAt: string
  sales: number
  earnings: number
  previewImage: string | null
  config: any | null
  editorData?: any | null
  type?: 'theme' | 'content' | 'template'
}

export default function ThemesPage() {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch('/api/designer/themes')
        if (response.ok) {
          const data = await response.json()
          setThemes(data)
        }
      } catch (error) {
        console.error('Error fetching themes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchThemes()
  }, [])

  // Filter to only show templates, then by status
  const templatesOnly = themes.filter(theme => {
    const type = theme.type || 'theme' // Default to 'theme' for backward compatibility
    return type === 'template'
  })

  const filteredThemes = filter === 'all' 
    ? templatesOnly 
    : templatesOnly.filter(theme => theme.status === filter)

  const handlePublishToggle = async (themeId: string, currentStatus: 'published' | 'draft') => {
    const newStatus = currentStatus === 'published' ? false : true
    
    try {
      const response = await fetch(`/api/designer/themes/${themeId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: newStatus,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        // Refresh themes list
        const themesResponse = await fetch('/api/designer/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to update theme status')
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      toast.error('An error occurred while updating theme status')
    }
  }

  const templates = themes.filter(t => (t.type || 'theme') === 'template')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Templates</h1>
          <p className="text-muted-foreground">Manage and track your created templates</p>
        </div>
        <Link href="/designer/dashboard/create-theme">
          <Button>
            <Plus className="w-4 h-4" />
            Create New Template
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Templates</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-2xl">{templates.length}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-2xl">{templates.filter(t => t.status === 'published').length}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-2xl">{templates.filter(t => t.status === 'draft').length}</CardTitle>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-2xl">{templates.reduce((sum, theme) => sum + theme.sales, 0)}</CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'all'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({templates.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'published'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Published ({templates.filter(t => t.status === 'published').length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 font-semibold text-sm transition-colors ${
            filter === 'draft'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Drafts ({templates.filter(t => t.status === 'draft').length})
        </button>
      </div>

      {/* Themes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden w-full max-w-[240px]">
              <div className="aspect-video bg-muted">
                <Skeleton className="w-full h-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
          {filteredThemes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden hover:shadow-lg transition-shadow w-full max-w-[240px]">
            {/* Preview Image */}
            <div className="aspect-[9/16] bg-muted relative overflow-hidden">
              <ThumbnailPreview
                templateId={theme.id}
                previewImageUrl={theme.previewImage}
                editorData={theme.editorData}
                width={240}
                height={426}
                className="w-full h-full"
              />
              {theme.status === 'published' && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  Published
                </div>
              )}
              {theme.status === 'draft' && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  Draft
                </div>
              )}
            </div>

            {/* Theme Info */}
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                {(theme.type === 'template' || theme.type === 'content') && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 uppercase">
                    {theme.type}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-xs">{new Date(theme.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales:</span>
                  <span className="font-semibold text-xs">{theme.sales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earnings:</span>
                  <span className="font-semibold text-xs">${theme.earnings.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5">
                {theme.status === 'published' ? (
                  <Button 
                    className="w-full" 
                    size="sm" 
                    variant="outline" 
                    disabled
                    title="Published templates cannot be edited"
                  >
                    Edit (Locked)
                  </Button>
                ) : (
                  <Link href={`/designer/dashboard/create-theme?id=${theme.id}`} className="flex-1">
                    <Button className="w-full" size="sm" variant="outline">Edit</Button>
                  </Link>
                )}
                <Link href={`/designer/dashboard/themes/${theme.id}/preview`} className="flex-1">
                  <Button className="w-full" variant="outline" size="sm">Preview</Button>
                </Link>
                <Button
                  className="flex-1"
                  variant={theme.status === 'published' ? 'secondary' : 'default'}
                  size="sm"
                  onClick={() => handlePublishToggle(theme.id, theme.status)}
                  disabled={theme.status === 'published'}
                  title={theme.status === 'published' ? 'Published templates cannot be unpublished' : 'Publish template'}
                >
                  {theme.status === 'published' ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Globe className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {!isLoading && filteredThemes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layout className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No templates found
            </p>
            <Link href="/designer/dashboard/create-theme">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




