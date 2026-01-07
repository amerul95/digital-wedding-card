"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { UsersRound, Palette, ShoppingBag, DollarSign } from 'lucide-react'

interface Designer {
  id: string
  email: string
  name: string
  themes: number
  totalSales: number
  totalEarnings: number
  joinedDate: string
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDesigners() {
      try {
        const response = await fetch('/api/admin/designers')
        if (response.ok) {
          const data = await response.json()
          setDesigners(data)
        }
      } catch (error) {
        console.error('Error fetching designers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDesigners()
  }, [])

  const totalDesigners = designers.length
  const totalThemes = designers.reduce((sum, d) => sum + d.themes, 0)
  const totalSales = designers.reduce((sum, d) => sum + d.totalSales, 0)
  const totalEarnings = designers.reduce((sum, d) => sum + d.totalEarnings, 0)

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Designers Management</h1>
        <p className="text-muted-foreground">Manage designers and their performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Designers</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDesigners}</div>
            <p className="text-xs text-muted-foreground">Registered designers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThemes}</div>
            <p className="text-xs text-muted-foreground">Created by designers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Theme sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Designer Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total paid to designers</p>
          </CardContent>
        </Card>
      </div>

      {/* Designers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Designers</CardTitle>
          <CardDescription>A list of all designers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Themes</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No designers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                designers.map((designer) => (
                  <TableRow key={designer.id}>
                    <TableCell className="font-medium">{designer.name}</TableCell>
                    <TableCell>{designer.email}</TableCell>
                    <TableCell>{designer.themes}</TableCell>
                    <TableCell>{designer.totalSales}</TableCell>
                    <TableCell className="font-semibold">${designer.totalEarnings.toFixed(2)}</TableCell>
                    <TableCell>{new Date(designer.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
