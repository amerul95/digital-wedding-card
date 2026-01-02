import React from 'react'

export default function LoginandCart() {
  return (
    <div className='flex space-x-2 justify-end'>
      <Login/>
      <Cart/>
    </div>
  )
}

function Login(){
  return(
      <a href="/login">
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