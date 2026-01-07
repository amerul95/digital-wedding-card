"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import React from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email"
  }).min(2, {
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Please enter your password"
  })
})

type LoginFormValues = z.infer<typeof formSchema>

export function DesignerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    } as LoginFormValues,
    onSubmit: async ({ value }) => {
      // Validate with zod
      const validationResult = formSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }
      
      // Get redirect URL from current search params (inside onSubmit to get latest value)
      const redirect = searchParams.get("redirect")
      let decodedRedirect = redirect ? decodeURIComponent(redirect) : "/designer/dashboard"
      // Ensure it starts with /
      if (!decodedRedirect.startsWith("/")) {
        decodedRedirect = "/" + decodedRedirect
      }
      console.log("Login attempt - Redirect URL:", decodedRedirect, "from param:", redirect)
      
      try {
        const response = await axios.post("/api/auth/designer/login", {
          email: validationResult.data.email,
          password: validationResult.data.password,
        }, {
          headers: { "Content-Type": "application/json" }
        })

        console.log("Login response:", response.status, response.data)
        
        if (response.status === 200 && response.data) {
          toast.success("Login successful")
          
          // Use redirect URL from response if available, otherwise use decodedRedirect
          const redirectUrl = response.data.redirect || decodedRedirect
          console.log("Login successful, redirecting to:", redirectUrl)
          
          // Wait longer to ensure cookie is processed by browser
          // The cookie is set via Set-Cookie header, browser needs time to process it
          setTimeout(() => {
            console.log("Executing redirect now to:", redirectUrl)
            // Use window.location.replace to avoid adding to history
            window.location.replace(redirectUrl)
          }, 1500)
        } else {
          console.error("Unexpected response:", response)
          toast.error("Login failed. Please try again.")
        }
      } catch (error: any) {
        console.error("Login error:", error)
        const message = error?.response?.data?.error || "Invalid email or password"
        toast.error(message)
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Designer Login</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your designer account
                </p>
              </div>
              
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = formSchema.shape.email.safeParse(value)
                    if (result.success) return undefined
                    const firstIssue = result.error.issues?.[0]
                    return firstIssue?.message || "Invalid email"
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      type="email"
                      autoComplete="email"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = formSchema.shape.password.safeParse(value)
                    if (result.success) return undefined
                    const firstIssue = result.error.issues?.[0]
                    return firstIssue?.message || "Invalid password"
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="current-password"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <Field>
                <Button type="submit" disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/designer/sign-up">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/assets/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

