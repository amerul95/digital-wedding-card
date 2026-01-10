import React, { useRef } from 'react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { weddingFormSchema } from '@/lib/schema/schema'
import { useFormContext } from '../FormContext'

export default function StepTwo() {
  const form = useFormContext()
  const couplesFontColor = useRef<HTMLInputElement>(null)

  const fontSize = form.state.values.ceremonynameFontsize || 20
  const color = form.state.values.fontColor || "#000000"

  const handlePreviewClick = () => {
    couplesFontColor.current?.click()
  }

  return (
    <FieldGroup>
      <form.Field
        name="ceremonyName"
        validators={{
          onChange: ({ value }: { value: any }) => {
            const result = weddingFormSchema.shape.ceremonyName.safeParse(value)
            if (result.success) return undefined
            const firstError = result.error.issues?.[0]
            return firstError?.message
          },
        }}
      >
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor='form-rhf-weddingcard'>
              Jenis Majlis
            </FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id='form-rhf-ceremonyName'
              placeholder='Please enter ceremony name'
              autoComplete='off'
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <form.Field
        name="ceremonynameFontsize"
        validators={{
          onChange: ({ value }: { value: any }) => {
            const result = weddingFormSchema.shape.ceremonynameFontsize.safeParse(value)
            if (result.success) return undefined
            const firstError = result.error.issues?.[0]
            return firstError?.message
          },
        }}
      >
        {(field: any) => (
          <Field>
            <FieldLabel>
              Size font
            </FieldLabel>
            <div className='flex justify-center items-center space-x-4'>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                id='form-rhf-ceremonyfontSize'
                placeholder='Please enter ceremony name'
                type='range'
                min={20}
                max={100}
                className='w-full p-0'
              />
              <div>{fontSize}</div>
            </div>
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <div>
        <form.Field
          name="couplesName"
          validators={{
            onChange: ({ value }: { value: any }) => {
              const result = weddingFormSchema.shape.couplesName.safeParse(value)
              if (result.success) return undefined
            const firstError = result.error.issues?.[0]
            return firstError?.message
            },
          }}
        >
          {(field: any) => (
            <Field>
              <FieldLabel>
                Nama Panggilan
              </FieldLabel>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                id='form-rhf-ceremonyfontSize'
                placeholder='Please enter couple name'
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500">{field.state.meta.errors[0]}</p>
              )}
            </Field>
          )}
        </form.Field>

        <div className='flex items-center gap-4 relative mt-2'>
          <form.Field
            name="couplesFontFamily"
            validators={{
              onChange: ({ value }: { value: any }) => {
                const result = weddingFormSchema.shape.couplesFontFamily.safeParse(value)
                if (result.success) return undefined
            const firstError = result.error.issues?.[0]
            return firstError?.message
              },
            }}
          >
            {(field: any) => (
              <Field>
                <Select 
                  onValueChange={(value) => field.handleChange(value)} 
                  value={field.state.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="times-roman">Times Roman</SelectItem>
                    <SelectItem value="abv">Vivaldi</SelectItem>
                    <SelectItem value="asdasd">Smanta</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500">{field.state.meta.errors[0]}</p>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="fontColor">
            {(field: any) => (
              <Field className='flex items-center gap-2 w-fit'>
                <Input
                  type="color"
                  id="fontColor"
                  ref={couplesFontColor}
                  value={field.state.value || "#000000"}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                />
                <div className="flex border justify-center items-center rounded-lg">
                  <p className="text-sm text-gray-700 px-1">{color}</p>
                  <div
                    onClick={handlePreviewClick}
                    className="w-10 h-10 rounded border cursor-pointer transition-all hover:scale-105 rounded-br-lg rounded-tr-lg"
                    style={{ backgroundColor: color }}
                    title="Click to change color"
                  />
                </div>
              </Field>
            )}
          </form.Field>
        </div>
      </div>
    </FieldGroup>
  )
}
