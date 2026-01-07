"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface WithdrawalRequest {
  id: string
  requestNumber: number
  designerId: string
  designerName: string
  designerEmail: string
  amount: number
  approvedAmount: number | null
  status: 'pending' | 'approved' | 'declined' | 'cancelled'
  createdAt: string
  approvedAt: string | null
  cancelledAt: string | null
  bankName: string | null
  accountOwnerName: string | null
  accountNumber: string | null
}

export default function PaymentsPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null)
  const [approveAmount, setApproveAmount] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch('/api/admin/payments')
        if (response.ok) {
          const data = await response.json()
          setRequests(data)
        }
      } catch (error) {
        console.error('Error fetching withdrawal requests:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleApprove = async (requestId: string, amount?: number) => {
    try {
      const response = await fetch(`/api/admin/payments/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          approvedAmount: amount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Withdrawal request approved successfully')
        setIsDialogOpen(false)
        setSelectedRequest(null)
        setApproveAmount('')
        // Refresh requests list
        const requestsResponse = await fetch('/api/admin/payments')
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          setRequests(requestsData)
        }
      } else {
        toast.error(data.error || 'Failed to approve withdrawal request')
      }
    } catch (error) {
      console.error('Error approving withdrawal request:', error)
      toast.error('An error occurred while approving withdrawal request')
    }
  }

  const handleDecline = async (requestId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'decline',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Withdrawal request declined')
        // Refresh requests list
        const requestsResponse = await fetch('/api/admin/payments')
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          setRequests(requestsData)
        }
      } else {
        toast.error(data.error || 'Failed to decline withdrawal request')
      }
    } catch (error) {
      console.error('Error declining withdrawal request:', error)
      toast.error('An error occurred while declining withdrawal request')
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const approvedRequests = requests.filter(r => r.status === 'approved')
  const totalPendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage designer withdrawal requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total pending withdrawals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>A list of all designer withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Designer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Approved At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No withdrawal requests found</p>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">#{request.requestNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.designerName}</div>
                        <div className="text-sm text-muted-foreground">{request.designerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">${request.amount.toFixed(2)}</div>
                        {request.approvedAmount && request.approvedAmount !== request.amount && (
                          <div className="text-sm text-muted-foreground">
                            Approved: ${request.approvedAmount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'pending' ? 'secondary' :
                        request.status === 'declined' ? 'destructive' :
                        'outline'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.bankName && request.accountNumber ? (
                        <div className="text-sm">
                          <div>{request.bankName}</div>
                          <div className="text-muted-foreground">{request.accountNumber}</div>
                          {request.accountOwnerName && (
                            <div className="text-muted-foreground">{request.accountOwnerName}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {request.approvedAt ? new Date(request.approvedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Dialog open={isDialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                            setIsDialogOpen(open)
                            if (!open) {
                              setSelectedRequest(null)
                              setApproveAmount('')
                            } else {
                              setSelectedRequest(request)
                              setApproveAmount(request.amount.toString())
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="default" size="sm">Approve</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Withdrawal Request</DialogTitle>
                                <DialogDescription>
                                  Review the withdrawal request and adjust the amount if needed.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Requested Amount</Label>
                                  <div className="text-sm font-semibold">${request.amount.toFixed(2)}</div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="approveAmount">Approved Amount</Label>
                                  <Input
                                    id="approveAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={approveAmount}
                                    onChange={(e) => setApproveAmount(e.target.value)}
                                    placeholder={request.amount.toString()}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Leave empty or enter same amount to approve as requested
                                  </p>
                                </div>
                                {request.accountOwnerName && request.designerName && (
                                  <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                    <div className="text-sm">
                                      <div className="font-medium text-yellow-800 dark:text-yellow-200">
                                        Account Name Verification
                                      </div>
                                      <div className="text-yellow-700 dark:text-yellow-300 mt-1">
                                        Account Owner: {request.accountOwnerName}
                                      </div>
                                      <div className="text-yellow-700 dark:text-yellow-300">
                                        Designer Name: {request.designerName}
                                      </div>
                                      {request.accountOwnerName.toLowerCase().trim() !== request.designerName.toLowerCase().trim() && (
                                        <div className="text-red-600 dark:text-red-400 font-medium mt-1">
                                          ⚠️ Names do not match! Payment will be cancelled.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    const amount = approveAmount ? parseFloat(approveAmount) : request.amount
                                    handleApprove(request.id, amount)
                                  }}
                                >
                                  Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDecline(request.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
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

