"use client"

import { LoginForm } from '@/app/features/LoginForm'

export default function LoginPage() {
  const loginRoute = process.env.LOGIN_ROUTE!

  return (
    <div>
      <LoginForm loginRoute={loginRoute} />
    </div>
  )
}
