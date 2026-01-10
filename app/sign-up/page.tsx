"use client"

import React, { Suspense } from 'react'
import { SignUpForm } from '../features/SignUpForm'

export default function SignUp() {
    const signupRoute = process.env.SIGNUP_ROUTE!

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm signUpRoute={signupRoute}/>
      </Suspense>
    </div>
  )
}
