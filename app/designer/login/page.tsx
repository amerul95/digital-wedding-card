"use client"

import React from 'react'
import { DesignerLoginForm } from '@/app/features/DesignerLoginForm'

export default function DesignerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <DesignerLoginForm />
      </div>
    </div>
  )
}
