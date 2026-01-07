"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Wallet, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface WithdrawalRequest {
  id: string
  requestNumber: number
  amount: number
  approvedAmount: number | null
  status: 'pending' | 'approved' | 'declined' | 'cancelled'
  createdAt: string
  approvedAt: string | null
  cancelledAt: string | null
}

interface WalletData {
  walletBalance: number
  bankName: string | null
  accountOwnerName: string | null
  accountNumber: string | null
  withdrawalRequests: WithdrawalRequest[]
}

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    async function fetchWallet() {
      try {
        const response = await fetch('/api/designer/withdrawals')
        if (response.ok) {
          const data = await response.json()
          setWalletData(data)
        }
      } catch (error) {
        console.error('Error fetching wallet:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWallet()
  }, [])

  const handleWithdrawalRequest = async () => {
    const amount = parseFloat(withdrawalAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!walletData?.bankName || !walletData?.accountOwnerName || !walletData?.accountNumber) {
      toast.error('Please fill in your payment details in profile settings first')
      return
    }

    setIsRequesting(true)
    try {
      const response = await fetch('/api/designer/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Withdrawal request created successfully')
        setWithdrawalAmount('')
        // Refresh wallet data
        const walletResponse = await fetch('/api/designer/withdrawals')
        if (walletResponse.ok) {
          const walletData = await walletResponse.json()
          setWalletData(walletData)
        }
      } else {
        toast.error(data.error || 'Failed to create withdrawal request')
      }
    } catch (error) {
      console.error('Error creating withdrawal request:', error)
      toast.error('An error occurred while creating withdrawal request')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleCancel = async (requestId: string) => {
    try {
      const response = await fetch(`/api/designer/withdrawals/${requestId}/cancel`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Withdrawal request cancelled successfully')
        // Refresh wallet data
        const walletResponse = await fetch('/api/designer/withdrawals')
        if (walletResponse.ok) {
          const walletData = await walletResponse.json()
          setWalletData(walletData)
        }
      } else {
        toast.error(data.error || 'Failed to cancel withdrawal request')
      }
    } catch (error) {
      console.error('Error cancelling withdrawal request:', error)
      toast.error('An error occurred while cancelling withdrawal request')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasPaymentDetails = walletData?.bankName && walletData?.accountOwnerName && walletData?.accountNumber
  const pendingRequests = walletData?.withdrawalRequests.filter(r => r.status === 'pending') || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and withdrawal requests</p>
        </div>
        <Link href="/designer/dashboard/profile">
          <Button variant="outline">Payment Details</Button>
        </Link>
      </div>

      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Available Balance
          </CardTitle>
          <CardDescription>Amount available for withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            ${(walletData?.walletBalance || 0).toFixed(2)}
          </div>
          {!hasPaymentDetails && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800 dark:text-yellow-200">
                  Payment details required
                </div>
                <div className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Please fill in your payment details in profile settings to request withdrawals.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Withdrawal */}
      {hasPaymentDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Withdraw funds to your bank account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={walletData?.walletBalance || 0}
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <p className="text-xs text-muted-foreground">
                Available: ${(walletData?.walletBalance || 0).toFixed(2)}
              </p>
            </div>
            <Button
              onClick={handleWithdrawalRequest}
              disabled={isRequesting || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
            >
              {isRequesting ? 'Requesting...' : 'Request Withdrawal'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>History of your withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Approved At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletData?.withdrawalRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No withdrawal requests found</p>
                  </TableCell>
                </TableRow>
              ) : (
                walletData?.withdrawalRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">#{request.requestNumber}</TableCell>
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
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {request.approvedAt ? new Date(request.approvedAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(request.id)}
                        >
                          Cancel
                        </Button>
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

