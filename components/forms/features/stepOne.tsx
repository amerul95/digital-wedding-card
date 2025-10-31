"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFormContext } from "react-hook-form"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { WeddingFormSchema, weddingFormSchema } from "@/lib/schema/schema"
import {z} from "zod"
import { Select,SelectContent,SelectTrigger,SelectValue ,SelectItem} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRef } from "react"


export default function StepOne() {
  const {watch,control,register,formState:{errors}} = useFormContext<WeddingFormSchema>()
  const colorInputRef = useRef<HTMLInputElement>(null)

  const color = watch("fontColor") || "#000000"

    const handlePreviewClick = () => {
    //click the hidden input
    colorInputRef.current?.click()
  }

  return (
          <FieldGroup>
                <Field >
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Pakej Pilihan
                  </FieldLabel>
                  <Controller
                    name="choosedPackage"
                    control={control} 
                    render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Your Pakej"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">RM60</SelectItem>
                        <SelectItem value="50">RM50</SelectItem>
                        <SelectItem value="40">RM40</SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    >

                  </Controller>
                  {
                    errors.groomName && <p className="text-red-500">{errors.choosedPackage?.message}</p>
                  }

                </Field>
                <Field>
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                     Add-On
                    </FieldLabel>
                    <Controller
                       name="isCustomDesign"
                       control={control}
                       render={({field}) => (
                <div className="flex items-center space-x-2">
                <Switch checked={field.value} id="rekaan-sendiri" onCheckedChange={field.onChange}/>
                <Label htmlFor="cover-video">Muatnaik Rekaan Sendiri (+RM10)</Label>
                </div>
                       )}
                     />
                    <Controller
                       name="isCustomVideoCover"
                       control={control}
                       render={({field}) => (
                <div className="flex items-center space-x-2">
                <Switch checked={field.value} id="rekaan-sendiri" onCheckedChange={field.onChange}/>
                <Label htmlFor="cover-video">Muatnaik Cover Sendiri (+RM10)</Label>
                </div>
                       )}
                     />
                </Field>
                <div>
                  -----------------------------------------------
                </div>
                                <Field >
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Groom Name
                  </FieldLabel>
                  <Input
                    {...register("groomName")}
                    id="form-rhf-demo-title"
                    placeholder="Please enter groom name"
                    autoComplete="off"
                  />
                  {
                    errors.groomName && <p className="text-red-500">{errors.groomName.message}</p>
                  }

                </Field>
                <Field >
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Bride Name
                  </FieldLabel>
                  <Input
                    {...register("brideName")}
                    id="form-rhf-demo-title"
                    placeholder="Please insert Bride Name"
                    autoComplete="off"
                  />
                  {
                    errors.brideName && <p className="text-red-500">{errors.brideName.message}</p>
                  }
                </Field>
                                <Field >
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Kod Rekaan
                  </FieldLabel>
                  <Controller
                    name="choosedPackage"
                    control={control} 
                    render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Your Pakej"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">VISUAL ID 1</SelectItem>
                        <SelectItem value="2">VISUAL ID 2</SelectItem>
                        <SelectItem value="3">VISUAL ID 3</SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    >

                  </Controller>
                  {
                    errors.groomName && <p className="text-red-500">{errors.choosedPackage?.message}</p>
                  }

                </Field>
                <div className="flex space-x-3">
                <Field className="max-w-96">
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Door Style
                  </FieldLabel>
                  <Controller
                    name="doorStyle"
                    control={control} 
                    render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Your Pakej"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">VISUAL ID 1</SelectItem>
                        <SelectItem value="2">VISUAL ID 2</SelectItem>
                        <SelectItem value="3">VISUAL ID 3</SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    >

                  </Controller>
                  {
                    errors.groomName && <p className="text-red-500">{errors.choosedPackage?.message}</p>
                  }

                </Field>

    <div className="flex items-center gap-4 relative">
      <Field className="flex items-center gap-2">
        <FieldLabel htmlFor="fontColor">Font Color</FieldLabel>

        <Controller
          name="fontColor"
          control={control}
          render={({ field }) => (
            <>
              {/* Hidden color input */}
              <Input
                type="color"
                id="fontColor"
                ref={colorInputRef}
                value={field.value || "#000000"}
                onChange={(e) => field.onChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
              />

              {/* Clickable color preview box */}
              <div className="flex border justify-center items-center rounded-lg">
                      {/* Show hex value beside it */}
              <p className="text-sm text-gray-700 px-1">{color}</p>
              <div
                onClick={handlePreviewClick}
                className="w-10 h-10 rounded border cursor-pointer transition-all hover:scale-105 rounded-br-lg rounded-tr-lg"
                style={{ backgroundColor: color }}
                title="Click to change color"
              ></div>

              </div>

            </>
          )}
        />
      </Field>
    </div>
</div>
                <div className="flex space-x-3">
                <Field className="max-w-96">
                  <FieldLabel htmlFor="form-rhf-weddingcard">
                    Animation Effect
                  </FieldLabel>
                  <Controller
                    name="animationEffect"
                    control={control} 
                    render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Your Pakej"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Animation ID 1</SelectItem>
                        <SelectItem value="2">Animation ID 2</SelectItem>
                        <SelectItem value="3">Animation ID 3</SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    >

                  </Controller>
                  {
                    errors.groomName && <p className="text-red-500">{errors.animationEffect?.message}</p>
                  }

                </Field>

    <div className="flex items-center gap-4 relative">
      <Field className="flex items-center gap-2">
        <FieldLabel htmlFor="fontColor">Animation Color</FieldLabel>

        <Controller
          name="animationColor"
          control={control}
          render={({ field }) => (
            <>
              {/* Hidden color input */}
              <Input
                type="color"
                id="animationColor"
                ref={colorInputRef}
                value={field.value || "#000000"}
                onChange={(e) => field.onChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
              />

              {/* Clickable color preview box */}
              <div className="flex border justify-center items-center rounded-lg">
                      {/* Show hex value beside it */}
              <p className="text-sm text-gray-700 px-1">{color}</p>
              <div
                onClick={handlePreviewClick}
                className="w-10 h-10 rounded border cursor-pointer transition-all hover:scale-105 rounded-br-lg rounded-tr-lg"
                style={{ backgroundColor: color }}
                title="Click to change color"
              ></div>

              </div>

            </>
          )}
        />
      </Field>
    </div>
</div>
</FieldGroup>
  )
}
