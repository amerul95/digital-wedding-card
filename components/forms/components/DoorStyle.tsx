import React from 'react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { Select,SelectContent,SelectTrigger,SelectValue ,SelectItem} from "@/components/ui/select"

export default function DoorStyle() {
  const { control } = useFormContext()

  return (
      <Field>
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
      </Field>
  )
}
