import React,{useRef} from 'react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { Select,SelectTrigger,SelectValue ,SelectItem,SelectContent } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { WeddingFormSchema } from '@/lib/schema/schema'

export default function StepTwo() {

    const {watch,control,register,formState:{errors}} = useFormContext<WeddingFormSchema>()
    const fontSize = watch("ceremonynameFontsize")
    const couplesFontColor = useRef<HTMLInputElement>(null)
    const color = watch("fontColor") || "#000000"

    const handlePreviewClick = () => {
      couplesFontColor.current?.click()
    }
    
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor='form-rhf-weddingcard'>
          Jenis Majlis
        </FieldLabel>
        <Input
          {...register("ceremonyName")}
          id='form-rhf-ceremonyName'
          placeholder='Please enter ceremony name'
          autoComplete='off'
        />
        {
          errors.ceremonyName && <p className="text-red-500">{errors.ceremonyName.message}</p>
        }
      </Field>
      <Field>
        <FieldLabel>
          Size font
        </FieldLabel>
        <div className='flex justify-center items-center space-x-4'>
        <Input
           {...register("ceremonynameFontsize")}
          id='form-rhf-ceremonyfontSize'
          placeholder='Please enter ceremony name'
          type='range'
          min={20}
          max={100}
          className='w-full p-0'
        />
        <div>{fontSize}</div>
        </div>

      </Field>
      <div>
        <Field>
          <FieldLabel>
            Nama Panggilan
          </FieldLabel>
          <Input
            {...register("couplesName")}
            id='form-rhf-ceremonyfontSize'
          placeholder='Please enter couple name'
          />
        </Field>
        <div className='flex items-center gap-4 relative mt-2'>
              <Field >
                  <Controller
                    name="choosedPackage"
                    control={control} 
                    render={({field}) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font family"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="times-roman">Times Roman</SelectItem>
                        <SelectItem value="abv">Vivaldi</SelectItem>
                        <SelectItem value="asdasd">Smanta</SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    >

                  </Controller>
                </Field>
                <Field className='flex items-center gap-2 w-fit'>
                          <Controller
                            name="fontColor"
                            control={control}
                            render={({ field }) => (
                              <>
                                {/* Hidden color input */}
                                <Input
                                  type="color"
                                  id="fontColor"
                                  ref={couplesFontColor}
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
