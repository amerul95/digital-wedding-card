"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Percent, Mail, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [commissionRate, setCommissionRate] = useState(15)
  const [siteName, setSiteName] = useState('Wedding App')
  const [siteEmail, setSiteEmail] = useState('admin@weddingapp.com')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoApproveThemes, setAutoApproveThemes] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage platform settings and configurations</p>
      </div>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Commission Settings
          </CardTitle>
          <CardDescription>Configure designer commission rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Designer Commission Rate (%)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Designers will receive {commissionRate}% of each sale. Company receives {100 - commissionRate}%.
              </p>
            </div>
          </div>
          <Button>Save Commission Settings</Button>
        </CardContent>
      </Card>

      {/* Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Settings
          </CardTitle>
          <CardDescription>Configure site-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteEmail">Admin Email</Label>
            <Input
              id="siteEmail"
              type="email"
              value={siteEmail}
              onChange={(e) => setSiteEmail(e.target.value)}
            />
          </div>
          <Button>Save Site Settings</Button>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Other Settings
          </CardTitle>
          <CardDescription>Additional platform configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email notifications for new orders</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoApproveThemes">Auto-approve Themes</Label>
              <p className="text-sm text-muted-foreground">Automatically approve themes from designers</p>
            </div>
            <Switch
              id="autoApproveThemes"
              checked={autoApproveThemes}
              onCheckedChange={setAutoApproveThemes}
            />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
