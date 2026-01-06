'use client'
import React from 'react'
import Image from 'next/image'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'

const contactFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters"
  }),
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters"
  }),
  readTutorials: z.boolean()
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactForm() {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
      readTutorials: false
    },
    onSubmit: async ({ value }) => {
      const validationResult = contactFormSchema.safeParse(value)
      if (!validationResult.success) {
        return
      }

      try {
        // TODO: Handle form submission
        console.log('Form submitted:', validationResult.data)
        toast.success('Message sent successfully!')
        form.reset()
      } catch (error) {
        toast.error('Failed to send message. Please try again.')
      }
    },
  })

  return (
    <div className='w-full max-w-[480px] ml-[200px]'>
      {/* Title */}
      <h1
        className='text-2xl font-bold text-[#36463A] mb-4 text-center'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        Contact Us
      </h1>

      {/* Intro Text */}
      <p
        className='text-gray-700 mb-6 text-left'
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
      >
        For any enquires or suggestion, please use this form,
      </p>

      {/* Form */}
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }} className='space-y-4'>
        {/* Full Name */}
        <form.Field
          name="fullName"
          validators={{
            onChange: ({ value }) => {
              const result = contactFormSchema.shape.fullName.safeParse(value)
              return result.success ? undefined : result.error.errors[0]?.message
            },
          }}
        >
          {(field) => (
            <div>
              <input
                type='text'
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder='Full Name'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email Address */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = contactFormSchema.shape.email.safeParse(value)
              return result.success ? undefined : result.error.errors[0]?.message
            },
          }}
        >
          {(field) => (
            <div>
              <input
                type='email'
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder='Email Address'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Your Messages */}
        <form.Field
          name="message"
          validators={{
            onChange: ({ value }) => {
              const result = contactFormSchema.shape.message.safeParse(value)
              return result.success ? undefined : result.error.errors[0]?.message
            },
          }}
        >
          {(field) => (
            <div>
              <textarea
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder='Your Messages'
                rows={6}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36463A] focus:border-transparent resize-none'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Checkbox */}
        <form.Field
          name="readTutorials"
        >
          {(field) => (
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='readTutorials'
                name={field.name}
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
                className='w-4 h-4 rounded border-gray-300 text-[#36463A] focus:ring-[#36463A] cursor-pointer'
              />
              <label
                htmlFor='readTutorials'
                className='text-gray-700 cursor-pointer'
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
              >
                I already read tutorials & FAQs
              </label>
            </div>
          )}
        </form.Field>

        {/* Send Button */}
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={form.state.isSubmitting}
            className='px-6 py-3 rounded-[20px] bg-[#36463A] text-white font-semibold flex items-center gap-2 hover:bg-[#2a3d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
          >
            {form.state.isSubmitting ? 'Sending...' : 'Send'}
            <Image
              src="/contactus/send.png"
              alt="Send"
              width={12}
              height={12}
              className='object-contain'
            />
          </button>
        </div>
      </form>
    </div>
  )
}

