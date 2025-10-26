import React from 'react'
import { SignUpForm } from '../features/SignUpForm'

export default function SignUp() {

    const signupRoute = process.env.SIGNUP_ROUTE!

  return (
    <div>
      <SignUpForm signUpRoute={signupRoute}/>
    </div>
  )
}
