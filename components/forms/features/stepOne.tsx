"use client"

import * as React from "react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { weddingFormSchema } from "@/lib/schema/schema"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRef } from "react"
import { useFormContext } from "../FormContext"

export default function StepOne() {
  const form = useFormContext()
  const colorInputRef = useRef<HTMLInputElement>(null)
  const animationColorInputRef = useRef<HTMLInputElement>(null)

  const fontColor = form.useStore((state) => state.values.fontColor) || "#000000"
  const animationColor = form.useStore((state) => state.values.animationColor) || "#000000"

  const handlePreviewClick = () => {
    colorInputRef.current?.click()
  }
  const handleAnimationColorClick = () => animationColorInputRef.current?.click()

  return (
    <FieldGroup>
      <form.Field
        name="choosedPackage"
        validators={{
          onChange: ({ value }) => {
            const result = weddingFormSchema.shape.choosedPackage.safeParse(value)
            return result.success ? undefined : result.error.errors[0]?.message
          },
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="form-rhf-weddingcard">
              Pakej Pilihan
            </FieldLabel>
            <Select 
              onValueChange={(value) => field.handleChange(value)} 
              value={field.state.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Your Pakej" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">RM60</SelectItem>
                <SelectItem value="50">RM50</SelectItem>
                <SelectItem value="40">RM40</SelectItem>
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <Field>
        <FieldLabel htmlFor="form-rhf-weddingcard">
          Add-On
        </FieldLabel>
        <form.Field name="isCustomDesign">
          {(field) => (
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.state.value} 
                id="rekaan-sendiri" 
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <Label htmlFor="rekaan-sendiri">Muatnaik Rekaan Sendiri (+RM10)</Label>
            </div>
          )}
        </form.Field>
        <form.Field name="isCustomVideoCover">
          {(field) => (
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.state.value} 
                id="cover-video" 
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <Label htmlFor="cover-video">Muatnaik Cover Sendiri (+RM10)</Label>
            </div>
          )}
        </form.Field>
      </Field>

      <div>
        -----------------------------------------------
      </div>

      <form.Field
        name="groomName"
        validators={{
          onChange: ({ value }) => {
            const result = weddingFormSchema.shape.groomName.safeParse(value)
            return result.success ? undefined : result.error.errors[0]?.message
          },
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="form-rhf-weddingcard">
              Groom Name
            </FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id="form-rhf-demo-title"
              placeholder="Please enter groom name"
              autoComplete="off"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <form.Field
        name="brideName"
        validators={{
          onChange: ({ value }) => {
            const result = weddingFormSchema.shape.brideName.safeParse(value)
            return result.success ? undefined : result.error.errors[0]?.message
          },
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="form-rhf-demo-description">
              Bride Name
            </FieldLabel>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              id="form-rhf-demo-title"
              placeholder="Please insert Bride Name"
              autoComplete="off"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <form.Field
        name="visualId"
        validators={{
          onChange: ({ value }) => {
            const result = weddingFormSchema.shape.visualId.safeParse(value)
            return result.success ? undefined : result.error.errors[0]?.message
          },
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="form-rhf-weddingcard">
              Kod Rekaan
            </FieldLabel>
            <Select 
              onValueChange={(value) => field.handleChange(value)} 
              value={field.state.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Your Pakej" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">VISUAL ID 1</SelectItem>
                <SelectItem value="2">VISUAL ID 2</SelectItem>
                <SelectItem value="3">VISUAL ID 3</SelectItem>
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-500">{field.state.meta.errors[0]}</p>
            )}
          </Field>
        )}
      </form.Field>

      <div className="flex space-x-3">
        <form.Field
          name="doorStyle"
          validators={{
            onChange: ({ value }) => {
              const result = weddingFormSchema.shape.doorStyle.safeParse(value)
              return result.success ? undefined : result.error.errors[0]?.message
            },
          }}
        >
          {(field) => (
            <Field className="max-w-96">
              <FieldLabel htmlFor="form-rhf-weddingcard">
                Door Style
              </FieldLabel>
              <Select 
                onValueChange={(value) => field.handleChange(value)} 
                value={field.state.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Door Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="swing">Swing</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="envelope">Envelope</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500">{field.state.meta.errors[0]}</p>
              )}
            </Field>
          )}
        </form.Field>

        <div className="flex items-center gap-4 relative">
          <Field className="flex items-center gap-2">
            <FieldLabel htmlFor="fontColor">Font Color</FieldLabel>
            <form.Field name="fontColor">
              {(field) => (
                <>
                  <Input
                    type="color"
                    id="fontColor"
                    ref={colorInputRef}
                    value={field.state.value || "#000000"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <div className="flex border justify-center items-center rounded-lg">
                    <p className="text-sm text-gray-700 px-1">{fontColor}</p>
                    <div
                      onClick={handlePreviewClick}
                      className="w-10 h-10 rounded border cursor-pointer transition-all hover:scale-105 rounded-br-lg rounded-tr-lg"
                      style={{ backgroundColor: fontColor }}
                      title="Click to change color"
                    />
                  </div>
                </>
              )}
            </form.Field>
          </Field>
        </div>
      </div>

      <div className="flex space-x-3">
        <form.Field
          name="animationEffect"
          validators={{
            onChange: ({ value }) => {
              const result = weddingFormSchema.shape.animationEffect.safeParse(value)
              return result.success ? undefined : result.error.errors[0]?.message
            },
          }}
        >
          {(field) => (
            <Field className="max-w-96">
              <FieldLabel htmlFor="form-rhf-weddingcard">
                Animation Effect
              </FieldLabel>
              <Select 
                onValueChange={(value) => field.handleChange(value)} 
                value={field.state.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Animation Effect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="snow">Snow</SelectItem>
                  <SelectItem value="petals">Petals</SelectItem>
                  <SelectItem value="bubbles">Bubbles</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500">{field.state.meta.errors[0]}</p>
              )}
            </Field>
          )}
        </form.Field>

        <div className="flex items-center gap-4 relative">
          <Field className="flex items-center gap-2">
            <FieldLabel htmlFor="animationColor">Animation Color</FieldLabel>
            <form.Field name="animationColor">
              {(field) => (
                <>
                  <Input
                    type="color"
                    id="animationColor"
                    ref={animationColorInputRef}
                    value={field.state.value || "#000000"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <div className="flex border justify-center items-center rounded-lg">
                    <p className="text-sm text-gray-700 px-1">{animationColor}</p>
                    <div
                      onClick={handleAnimationColorClick}
                      className="w-10 h-10 rounded border cursor-pointer transition-all hover:scale-105 rounded-br-lg rounded-tr-lg"
                      style={{ backgroundColor: animationColor }}
                      title="Click to change color"
                    />
                  </div>
                </>
              )}
            </form.Field>
          </Field>
        </div>
      </div>
    </FieldGroup>
  )
}
