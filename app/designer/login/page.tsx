"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DesignerLoginForm } from '@/app/features/DesignerLoginForm'
import axios from 'axios'

export default function DesignerLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if session is still active
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/auth/designer/check-session')
        if (response.data.authenticated) {
          // Session is active, redirect to dashboard
          router.replace('/designer/dashboard')
        }
      } catch (error) {
        // Session not active, stay on login page
        console.log('No active session')
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <DesignerLoginForm />
      </div>
    </div>
  )
}
