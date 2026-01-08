'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

export function ClientSessionChecker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only check on pages that are not /designer or /admin routes
    if (pathname?.startsWith('/designer') || pathname?.startsWith('/admin')) {
      return
    }

    // Check if client session is active
    const checkClientSession = async () => {
      try {
        const response = await axios.get('/api/auth/client/check-session')
        if (response.data.authenticated) {
          // Client session is active - they are auto-logged in
          // The session is already active, so no action needed
          // But we can trigger any client-side updates if needed
          console.log('Client session active - auto-logged in')
        }
      } catch (error) {
        // No active session
        console.log('No active client session')
      }
    }

    checkClientSession()
  }, [pathname])

  return null // This component doesn't render anything
}


