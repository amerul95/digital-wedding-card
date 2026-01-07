"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Palette, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface Theme {
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
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleApprove = async (themeId: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${themeId}/approve`, {
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
        toast.success(data.message || 'Theme approved successfully')
        // Refresh themes list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to approve theme')
      }
    } catch (error) {
      console.error('Error approving theme:', error)
      toast.error('An error occurred while approving theme')
    }
  }

  const handleReject = async (themeId: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${themeId}/approve`, {
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
        toast.success(data.message || 'Theme rejected')
        // Refresh themes list
        const themesResponse = await fetch('/api/admin/themes')
        if (themesResponse.ok) {
          const themesData = await themesResponse.json()
          setThemes(themesData)
        }
      } else {
        toast.error(data.error || 'Failed to reject theme')
      }
    } catch (error) {
      console.error('Error rejecting theme:', error)
      toast.error('An error occurred while rejecting theme')
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
          <h1 className="text-3xl font-bold tracking-tight">Themes Management</h1>
          <p className="text-muted-foreground">Review and manage all themes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThemes}</div>
            <p className="text-xs text-muted-foreground">All created themes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedThemes}</div>
            <p className="text-xs text-muted-foreground">Published themes</p>
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
          <CardTitle>Themes</CardTitle>
          <CardDescription>A list of all themes in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme Name</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No themes found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredThemes.map((theme) => (
                  <TableRow key={theme.id}>
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
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
