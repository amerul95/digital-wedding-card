"use client"

import React, { useState } from 'react'
import { weddingFormSchema } from '@/lib/schema/schema'
import * as z from "zod"
import { useForm } from "@tanstack/react-form"
import { steps } from './steps'
import type { WeddingFormSchema } from '@/lib/schema/schema'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { FormProvider } from './FormContext'

export default function MultiForm() {

  const form = useForm<WeddingFormSchema>({
    defaultValues: {
      // form 2
      couplesFontFamily: "times-roman",
      couplesName: "",
      ceremonyName: "",
      ceremonynameFontsize: 20,
      // form 
      animationColor: "",
      animationEffect: "",
      fontColor: "",
      visualId: "",
      doorStyle: "",
      choosedPackage: "",
      groomName: "",
      brideName: "",
      eventDate: "",
      themeColor: "",
      message: "",
      isCustomDesign: false,
      isCustomVideoCover: false,
    },
    onSubmit: async ({ value }) => {
      const validationResult = weddingFormSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }
      console.log("Final data:", validationResult.data)
    },
  })

  const [step, setStep] = useState(0)
  const CurrentStep = steps[step].component

  const nextStep = async () => {
    const currentFields = steps[step].fields
    
    // Validate current step fields
    let isValid = true
    for (const field of currentFields) {
      const fieldState = form.getFieldInfo(field as any)
      if (fieldState?.meta.errors && fieldState.meta.errors.length > 0) {
        isValid = false
        break
      }
    }

    // Trigger validation for current fields
    await Promise.all(
      currentFields.map(field => form.validateField(field as any, "change"))
    )

    // Check if all fields are valid
    const fieldStates = currentFields.map(field => form.getFieldInfo(field as any))
    const allValid = fieldStates.every(state => !state?.meta.errors || state.meta.errors.length === 0)

    if (!allValid) {
      return
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  return (
    <Card>
      <CardContent>
        <FormProvider form={form}>
          <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }} className="space-y-4">
            <h2 className='text-xl font-semibold'>{steps[step].id}</h2>
            <div>
              <CurrentStep />
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                className='hover:cursor-pointer' 
                disabled={step === 0} 
                onClick={prevStep}
              >
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button 
                  type="button" 
                  className='hover:cursor-pointer' 
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className='hover:cursor-pointer'
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
