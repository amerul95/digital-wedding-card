"use client"

import React, { Suspense } from 'react'
import { LoginForm } from '@/app/features/LoginForm'

export default function page() {
  const loginRoute = process.env.LOGIN_ROUTE!
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm loginRoute={loginRoute}/>
      </Suspense>
    </div>
  )
}
