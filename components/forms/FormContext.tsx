"use client"

import React, { createContext, useContext } from "react"
import type { FormApi } from "@tanstack/react-form"

const FormContext = createContext<any>(null)

export function FormProvider({ 
  form, 
  children 
}: { 
  form: any
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



