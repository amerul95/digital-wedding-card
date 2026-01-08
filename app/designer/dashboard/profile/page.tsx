"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { User, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileData {
  id: string
  name: string | null
  address: string | null
  bio: string | null
  bankName: string | null
  accountOwnerName: string | null
  accountNumber: string | null
  walletBalance: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bio: '',
    bankName: '',
    accountOwnerName: '',
    accountNumber: '',
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/designer/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData({
            name: data.name || '',
            address: data.address || '',
            bio: data.bio || '',
            bankName: data.bankName || '',
            accountOwnerName: data.accountOwnerName || '',
            accountNumber: data.accountNumber || '',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/designer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Profile updated successfully')
        // Refresh profile data
        const profileResponse = await fetch('/api/designer/profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
          setFormData({
            name: profileData.name || '',
            address: profileData.address || '',
            bio: profileData.bio || '',
            bankName: profileData.bankName || '',
            accountOwnerName: profileData.accountOwnerName || '',
            accountNumber: profileData.accountNumber || '',
          })
        }
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating profile')
    } finally {
      setIsSaving(false)
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
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const nameMatch = formData.accountOwnerName && formData.name
    ? formData.accountOwnerName.toLowerCase().trim() === formData.name.toLowerCase().trim()
    : true

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your profile and payment details</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Bank account information for withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.accountOwnerName && formData.name && !nameMatch && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-red-800 dark:text-red-200">
                    Warning: Account owner name mismatch
                  </div>
                  <div className="text-red-700 dark:text-red-300 mt-1">
                    The account owner name must match your registered designer name exactly. 
                    Payments will be cancelled if names do not match.
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountOwnerName">Account Owner Name</Label>
              <Input
                id="accountOwnerName"
                value={formData.accountOwnerName}
                onChange={(e) => setFormData({ ...formData, accountOwnerName: e.target.value })}
                placeholder="Enter account owner name"
              />
              <p className="text-xs text-muted-foreground">
                Must match your registered designer name exactly
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Enter account number"
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}


