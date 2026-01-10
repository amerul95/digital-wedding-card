"use client"

import React, { Suspense } from 'react'
import { DesignerSignUpForm } from '@/app/features/DesignerSignUpForm'

export default function DesignerSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Suspense fallback={<div>Loading...</div>}>
          <DesignerSignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
