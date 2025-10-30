"use client"

import React, { useState } from 'react'
import { weddingFormSchema } from '@/lib/schema/schema'
import * as z from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { steps } from './steps'

export default function MultiForm() {

const methods = useForm({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: {
      groomName: "",
      brideName: "",
      eventDate: "",
      themeColor: "",
      message: "",
    },
  })

  const [step,setStep] = useState(0)
  const CurrentStep = steps[step].components

  const nextStep = ()=> setStep((prev) => Math.min(prev+1,steps.length-1))
  const prevStep = ()=> setStep((prev) => Math.max(prev-1,0))

//   submit to backend
const onSubmit = () => {

}

  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <h2 className='text-xl font-semibold'>{steps[step].id}</h2>
            <div>
                <CurrentStep/>
            </div>
            <div className="flex justify-between">
                {step > 0 && (
                <button type="button" className='hover:cursor-pointer' onClick={prevStep}>
                    Back
                </button>
                )}
                {step < steps.length - 1 ? (
            <button type="button" className='hover:cursor-pointer' onClick={nextStep} >
              Next
            </button>
                ) : (
            <button type="submit" className='hover:cursor-pointer'>Submit</button>
                )}
        </div>
        </form>
    </FormProvider>
  )
}
