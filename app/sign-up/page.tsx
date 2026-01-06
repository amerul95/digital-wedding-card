import { SignUpForm } from '../features/SignUpForm'

export default function SignUpPage() {
  const signupRoute = process.env.SIGNUP_ROUTE!

  return (
    <div>
      <SignUpForm signUpRoute={signupRoute} />
    </div>
  )
}
