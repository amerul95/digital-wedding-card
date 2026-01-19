"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DesignerRoleRequest {
  id: string
  userId: string
  fullName: string
  status: string
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  user: {
    id: string
    email: string
    createdAt: string
  }
}

export default function DesignerRequestsPage() {
  const [requests, setRequests] = useState<DesignerRoleRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<DesignerRoleRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/designer-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        toast.error('Failed to fetch designer role requests')
      }
    } catch (error) {
      console.error('Error fetching designer role requests:', error)
      toast.error('An error occurred while fetching requests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/designer-requests/${requestId}`, {
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
        toast.success(data.message || 'Designer role request approved successfully')
        setIsDialogOpen(false)
        setSelectedRequest(null)
        fetchRequests()
      } else {
        toast.error(data.error || 'Failed to approve request')
      }
    } catch (error) {
      console.error('Error approving request:', error)
      toast.error('An error occurred while approving request')
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/designer-requests/${requestId}`, {
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
        toast.success(data.message || 'Designer role request rejected')
        setIsDialogOpen(false)
        setSelectedRequest(null)
        fetchRequests()
      } else {
        toast.error(data.error || 'Failed to reject request')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      toast.error('An error occurred while rejecting request')
    }
  }

  const openDialog = (request: DesignerRoleRequest, actionType: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setAction(actionType)
    setIsDialogOpen(true)
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Designer Role Requests</h1>
        <p className="text-muted-foreground">
          Review and manage designer role requests from clients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending designer role requests
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.user.email}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{request.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openDialog(request, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDialog(request, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve' : 'Reject'} Designer Role Request
            </DialogTitle>
            <DialogDescription>
              {action === 'approve' 
                ? `Are you sure you want to approve the designer role request for ${selectedRequest?.user.email}? This will grant them designer access.`
                : `Are you sure you want to reject the designer role request for ${selectedRequest?.user.email}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={action === 'approve' ? 'default' : 'destructive'}
              onClick={() => {
                if (selectedRequest) {
                  if (action === 'approve') {
                    handleApprove(selectedRequest.id)
                  } else {
                    handleReject(selectedRequest.id)
                  }
                }
              }}
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
