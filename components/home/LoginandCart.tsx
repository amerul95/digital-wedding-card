'use client'
import React from 'react'
import { useLoginModal } from '@/context/LoginModalContext'

export default function LoginandCart() {
  return (
    <div className='flex space-x-2 justify-end'>
      <Login/>
      <Cart/>
    </div>
  )
}

function Login(){
  const { openModal } = useLoginModal()

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    openModal()
  }

  return(
      <a href="#" onClick={handleLoginClick} className='cursor-pointer'>
        <p>Login / Sign Up</p>
      </a>
  )
}

function Cart(){
  return(
    <a href="/cart">
      <p>CART</p>
    </a>
  )
}