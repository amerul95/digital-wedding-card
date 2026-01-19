"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Palette, CheckCircle, Clock, DollarSign, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id: string
  name: string
  designer: string
  status: 'published' | 'pending'
  createdAt: string
  sales: number
  revenue: number
}

export default function ThemesPage() {
  const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all')
  const [themes, setThemes] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [themeToDelete, setThemeToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedThemeIds, setSelectedThemeIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch('/api/admin/themes')
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

  const filteredThemes = filter === 'all' 
    ? themes 
    : themes.filter(theme => theme.status === filter)

  const totalThemes = themes.length
  const publishedThemes = themes.filter(t => t.status === 'published').length
  const pendingThemes = themes.filter(t => t.status === 'pending').length
  const totalRevenue = themes.reduce((sum, theme) => sum + theme.revenue, 0)

  const selectedCount = selectedThemeIds.size
  const allFilteredSelected = filteredThemes.length > 0 && filteredThemes.every(theme => selectedThemeIds.has(theme.id))
  const someFilteredSelected = filteredThemes.some(theme => selectedThemeIds.has(theme.id))

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelected = new Set(selectedThemeIds)
      filteredThemes.forEach(theme => newSelected.add(theme.id))
      setSelectedThemeIds(newSelected)
    } else {
      const newSelected = new Set(selectedThemeIds)
      filteredThemes.forEach(theme => newSelected.delete(theme.id))
      setSelectedThemeIds(newSelected)
    }
  }

  const handleSelectTheme = (themeId: string, checked: boolean | "indeterminate") => {
    const newSelected = new Set(selectedThemeIds)
    if (checked === true) {
      newSelected.add(themeId)
    } else {
      newSelected.delete(themeId)
    }
    setSelectedThemeIds(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedCount === 0) return
    setBulkDeleteDialogOpen(true)
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedCount === 0) return

    setIsBulkDeleting(true)
    try {
      const response = await fetch('/api/admin/themes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: Array.from(selectedThemeIds),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || `Successfully deleted ${selectedCount} template(s)`)
        setBulkDeleteDialogOpen(false)
        setSelectedThemeIds(new Set())
        // Refresh templates list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to delete templates')
      }
    } catch (error) {
      console.error('Error bulk deleting templates:', error)
      toast.error('An error occurred while deleting templates')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleApprove = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${templateId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Template approved successfully')
        // Refresh templates list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to approve template')
      }
    } catch (error) {
      console.error('Error approving template:', error)
      toast.error('An error occurred while approving template')
    }
  }

  const handleReject = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${templateId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Template rejected')
        // Refresh templates list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to reject template')
      }
    } catch (error) {
      console.error('Error rejecting template:', error)
      toast.error('An error occurred while rejecting template')
    }
  }

  const handleDelete = async (templateId: string, templateName: string) => {
    setThemeToDelete({ id: templateId, name: templateName })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!themeToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/themes/${themeToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Template deleted successfully')
        setDeleteDialogOpen(false)
        setThemeToDelete(null)
        // Refresh templates list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('An error occurred while deleting template')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates Management</h1>
          <p className="text-muted-foreground">Review and manage all templates</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThemes}</div>
            <p className="text-xs text-muted-foreground">All created templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedThemes}</div>
            <p className="text-xs text-muted-foreground">Published templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingThemes}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all themes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({totalThemes})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedThemes})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingThemes})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Themes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Templates</CardTitle>
              <CardDescription>A list of all templates in the system</CardDescription>
            </div>
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} template{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all templates"
                  />
                </TableHead>
                <TableHead>Template Name</TableHead>
                <TableHead>Designer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThemes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No templates found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredThemes.map((theme) => (
                  <TableRow key={theme.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedThemeIds.has(theme.id)}
                        onCheckedChange={(checked) => handleSelectTheme(theme.id, checked)}
                        aria-label={`Select ${theme.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{theme.name}</TableCell>
                    <TableCell>{theme.designer}</TableCell>
                    <TableCell>
                      <Badge variant={theme.status === 'published' ? 'default' : 'secondary'}>
                        {theme.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(theme.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{theme.sales}</TableCell>
                    <TableCell className="font-semibold">${theme.revenue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {theme.status === 'pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApprove(theme.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleReject(theme.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Link href={`/preview?templateId=${theme.id}`} target="_blank">
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(theme.id, theme.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{themeToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setThemeToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Templates</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} template{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBulkDeleteDialogOpen(false)
              }}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? 'Deleting...' : `Delete ${selectedCount} Template${selectedCount !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
