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

const SignUpFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email"
  }).min(2, {
    message: "Please enter your email"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  confirmPassword: z.string().min(6, {
    message: "Please confirm your password"
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type SignUpFormValues = z.infer<typeof SignUpFormSchema>

export function DesignerSignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const decodedRedirect = redirect ? decodeURIComponent(redirect) : "/designer/dashboard"

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: ""
    } as SignUpFormValues,
    onSubmit: async ({ value }) => {
      const validationResult = SignUpFormSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }

      try {
        const response = await axios.post("/api/sign-up/designer", {
          fullName: validationResult.data.fullName,
          email: validationResult.data.email,
          password: validationResult.data.password,
          address: validationResult.data.address
        }, {
          headers: { "Content-Type": "application/json" }
        })

        if (response.status === 201) {
          toast.success(response.data.message || "Account created successfully")
          router.push("/designer/login")
        }
      } catch (error: any) {
        const message = error?.response?.data?.error || "Something went wrong"
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
                <h1 className="text-2xl font-bold">Designer Sign Up</h1>
                <p className="text-muted-foreground text-balance">
                  Create your designer account
                </p>
              </div>
              
              <form.Field
                name="fullName"
                validators={{
                  onChange: ({ value }) => {
                    const result = SignUpFormSchema.shape.fullName.safeParse(value)
                    if (result.success) return undefined
                    const firstError = result.error.issues?.[0]
                    return firstError?.message || "Invalid full name"
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      type="text"
                      autoComplete="name"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = SignUpFormSchema.shape.email.safeParse(value)
                    if (result.success) return undefined
                    const firstError = result.error.issues?.[0]
                    return firstError?.message || "Invalid email"
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
                    const result = SignUpFormSchema.shape.password.safeParse(value)
                    if (result.success) return undefined
                    const firstError = result.error.issues?.[0]
                    return firstError?.message || "Invalid password"
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
                      autoComplete="new-password"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: ({ value }) => {
                    // Get password value from form state directly
                    const password = form.state.values.password
                    if (value && password && value !== password) {
                      return "Passwords do not match"
                    }
                    const result = SignUpFormSchema.shape.confirmPassword.safeParse(value)
                    if (result.success) return undefined
                    const firstError = result.error.issues?.[0]
                    return firstError?.message || "Invalid password confirmation"
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="new-password"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="address"
                validators={{
                  onChange: ({ value }) => {
                    const result = SignUpFormSchema.shape.address.safeParse(value)
                    if (result.success) return undefined
                    const firstError = result.error.issues?.[0]
                    return firstError?.message || "Invalid address"
                  },
                }}
              >
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      type="text"
                      autoComplete="street-address"
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
                  {form.state.isSubmitting ? "Signing up..." : "Sign Up"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center">
                Already have an account? <a href="/designer/login">Login</a>
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


