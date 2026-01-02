"use client"

import React, { useState } from 'react'
import { weddingFormSchema } from '@/lib/schema/schema'
import * as z from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { steps } from './steps'
import type { WeddingFormSchema } from '@/lib/schema/schema'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import StepTwo from './features/StepTwo'

export default function MultiForm() {

const methods = useForm<WeddingFormSchema>({
    resolver: zodResolver(weddingFormSchema),

    defaultValues: {
    // form 2
    couplesFontFamily:"times-roman",
    couplesName:"",
    ceremonyName:"",
    ceremonynameFontsize:20,
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
  })

  const [step,setStep] = useState(0)
  const CurrentStep = steps[step].component

  const nextStep = async ()=> {
    const currentFields = steps[step].fields
    const valid = await methods.trigger(currentFields)
    console.log(valid)
    if(!valid) return
    setStep((prev) => Math.min(prev+1,steps.length-1))
  }
  const prevStep = ()=> setStep((prev) => Math.max(prev-1,0))

//   submit to backend
const onSubmit = (data:WeddingFormSchema) => {
  console.log("Final data:", data)
}

  return (
    <Card>
      <CardContent>
          <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className='text-xl font-semibold'>{steps[step].id}</h2>
            <div>
                {/* <CurrentStep/> */}
                <StepTwo/>

            </div>
            <div className="flex justify-between">
                <Button type="button" className='hover:cursor-pointer' disabled={step > 0 ?false:true} onClick={prevStep}>
                    Back
                </Button>
                {step < steps.length - 1 ? (
            <Button type="button" className='hover:cursor-pointer' onClick={nextStep} >
              Next
            </Button>
                ) : (
            <Button type="submit" className='hover:cursor-pointer'>Submit</Button>
                )}
        </div>
        </form>
    </FormProvider>
      </CardContent>

    </Card>
  )
}
