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
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type SignUpFormValues = z.infer<typeof SignUpFormSchema>

export function AdminSignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const decodedRedirect = redirect ? decodeURIComponent(redirect) : "/admin/dashboard"

  const form = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value }) => {
      const validationResult = SignUpFormSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }

      try {
        const response = await axios.post("/api/sign-up/admin", {
          email: validationResult.data.email,
          password: validationResult.data.password
        }, {
          headers: { "Content-Type": "application/json" }
        })

        if (response.status === 201) {
          toast.success(response.data.message || "Account created successfully")
          router.push("/admin/login")
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
                <h1 className="text-2xl font-bold">Admin Sign Up</h1>
                <p className="text-muted-foreground text-balance">
                  Create your admin account
                </p>
              </div>
              
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = SignUpFormSchema.shape.email.safeParse(value)
                    return result.success ? undefined : result.error.errors[0]?.message
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
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = SignUpFormSchema.shape.password.safeParse(value)
                    return result.success ? undefined : result.error.errors[0]?.message
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
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: ({ value, formApi }) => {
                    const password = formApi.getFieldValue("password")
                    if (value !== password) {
                      return "Passwords do not match"
                    }
                    const result = SignUpFormSchema.shape.confirmPassword.safeParse(value)
                    return result.success ? undefined : result.error.errors[0]?.message
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
                      <FieldError errors={field.state.meta.errors} />
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
                Already have an account? <a href="/admin/login">Login</a>
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

