"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useState } from 'react'
import { weddingFormSchema } from "@/lib/schema/schema"
import {z} from "zod"

const stepOneSchema = weddingFormSchema.pick({
  groomName:true,
  brideName:true
})

type StepOneScheme = z.infer<typeof stepOneSchema>;

const formOneSchema = z.object({
  groomName:z.string().min(2,"Min name is 2"),
  brideName:z.string().min(2,"Min name is 2")
})

export default function StepOne() {

  const form = useForm<StepOneScheme>({
    resolver:zodResolver(stepOneSchema),
    defaultValues:{
      groomName:"",
      brideName:""
    }
  })

  const onSubmit = (data:StepOneScheme) => {console.log(data)}

  return (
    <Card className="w-full sm:max-w-md">
      {/* <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader> */}
      <CardContent>

          <FieldGroup>
            <Controller
              name="groomName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Groom Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Please enter groom name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="brideName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Bride Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Please insert Bride Name"
                    autoComplete="of"
                  />
                </Field>
              )}
            />
          </FieldGroup>
      </CardContent>
    </Card>
  )
}
