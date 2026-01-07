"use client"

import React from 'react'
import { AdminLoginForm } from '@/app/features/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <AdminLoginForm />
      </div>
    </div>
  )
}
