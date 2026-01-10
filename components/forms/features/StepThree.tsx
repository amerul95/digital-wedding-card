import React from 'react'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { weddingFormSchema } from '@/lib/schema/schema'
import { useFormContext } from '../FormContext'

export default function StepThree() {
  const form = useFormContext()

  return (
    <FieldGroup>
      <form.Field
        name="message"
        validators={{
          onChange: ({ value }: { value: any }) => {
            if (!value) return undefined
            // Message is optional, so no validation needed unless you want to add min length
            return undefined
          },
        }}
      >
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor='form-rhf-message'>
              Message (Optional)
            </FieldLabel>
            <Input
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id='form-rhf-message'
              placeholder='Enter your message'
              autoComplete='off'
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <form.Field
        name="eventDate"
        validators={{
          onChange: ({ value }: { value: any }) => {
            const result = weddingFormSchema.shape.eventDate.safeParse(value)
            if (result.success) return undefined
            const firstError = result.error.issues?.[0]
            return firstError?.message
          },
        }}
      >
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor='form-rhf-eventDate'>
              Event Date
            </FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id='form-rhf-eventDate'
              type='date'
              autoComplete='off'
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <form.Field
        name="themeColor"
      >
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor='form-rhf-themeColor'>
              Theme Color (Optional)
            </FieldLabel>
            <Input
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id='form-rhf-themeColor'
              type='color'
              autoComplete='off'
            />
          </Field>
        )}
      </form.Field>
    </FieldGroup>
  )
}
