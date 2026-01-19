"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

// Individual field schema for validation
const emailSchema = z.string().email({
  message: "Please enter a valid email address"
}).min(1, {
  message: "Email is required"
})

const RequestFormSchema = z.object({
  email: emailSchema
})

type RequestFormValues = z.infer<typeof RequestFormSchema>

export function DesignerSignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasPendingRequest, setHasPendingRequest] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const checkAuthAndRequest = async () => {
      try {
        // Check if user is authenticated
        const sessionResponse = await axios.get("/api/auth/client/check-session")
        if (sessionResponse.data.authenticated) {
          setIsAuthenticated(true)
          setUserEmail(sessionResponse.data.user?.email || "")
          
          // Check if user has pending request
          const requestResponse = await axios.get("/api/client/request-designer-role")
          if (requestResponse.data.hasPendingRequest) {
            setHasPendingRequest(true)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthAndRequest()
  }, [])

  const form = useForm({
    defaultValues: {
      email: userEmail
    } as RequestFormValues,
    onSubmit: async ({ value }) => {
      const validationResult = RequestFormSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }

      try {
        const response = await axios.post("/api/client/request-designer-role", {
          email: validationResult.data.email
        }, {
          headers: { "Content-Type": "application/json" }
        })

        if (response.status === 201) {
          toast.success(response.data.message || "Designer role request submitted successfully")
          setHasPendingRequest(true)
          form.reset()
        }
      } catch (error: any) {
        const message = error?.response?.data?.error || "Something went wrong"
        toast.error(message)
      }
    },
  })

  // Update form when userEmail is loaded
  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Designer Role</CardTitle>
          <CardDescription>
            You must be logged in as a client to request designer role
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-muted-foreground text-center">
              Please sign up or log in as a client first, then you can request to become a designer.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hasPendingRequest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Designer Role</CardTitle>
          <CardDescription>
            Your request is pending approval
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-muted-foreground text-center">
              You have already submitted a designer role request. Please wait for admin approval.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Request Designer Role</CardTitle>
          <CardDescription>
            Submit a request to become a designer. Your request will be reviewed by an admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}>
            <FieldGroup>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = emailSchema.safeParse(value)
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
                      placeholder="Enter your email"
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors.filter((err): err is string => typeof err === 'string').map(err => ({ message: err }))} />
                    )}
                  </Field>
                )}
              </form.Field>

              <Field>
                <Button type="submit" disabled={form.state.isSubmitting} className="w-full">
                  {form.state.isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center">
                After submission, please wait for admin approval. You will be notified once your request is reviewed.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


