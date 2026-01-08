"use client"

import React, { createContext, useContext } from "react"
import { FormApi } from "@tanstack/react-form"
import { WeddingFormSchema } from "@/lib/schema/schema"

const FormContext = createContext<FormApi<WeddingFormSchema, undefined> | null>(null)

export function FormProvider({ 
  form, 
  children 
}: { 
  form: FormApi<WeddingFormSchema, undefined>
  children: React.ReactNode 
}) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const form = useContext(FormContext)
  if (!form) {
    throw new Error("useFormContext must be used within FormProvider")
  }
  return form
}



