'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthMode = 'login' | 'signup'

interface LoginModalContextType {
  isOpen: boolean
  mode: AuthMode
  openModal: (mode?: AuthMode) => void
  closeModal: () => void
  switchMode: (mode: AuthMode) => void
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('login')

  const openModal = (newMode: AuthMode = 'login') => {
    setMode(newMode)
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)
  
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
  }

  return (
    <LoginModalContext.Provider value={{ isOpen, mode, openModal, closeModal, switchMode }}>
      {children}
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const context = useContext(LoginModalContext)
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider')
  }
  return context
}












