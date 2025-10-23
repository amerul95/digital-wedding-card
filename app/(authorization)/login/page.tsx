"use client"

import React from 'react'
// import { LoginForm } from '@/app/features/LoginForm'
import LoginForms from '@/app/features/LoginForm'

export default function page() {

  const loginRoute = process.env.LOGIN_ROUTE!
  return (
    <div>
        <LoginForms />
    </div>
  )
}
