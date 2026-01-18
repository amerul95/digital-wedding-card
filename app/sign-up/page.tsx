"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginModal } from '@/context/LoginModalContext'

export default function SignUp() {
  const router = useRouter()
  const { openModal } = useLoginModal()

  // Redirect to open signup modal instead of showing page
  useEffect(() => {
    openModal('signup')
    router.push('/')
  }, [openModal, router])

  return null
}
