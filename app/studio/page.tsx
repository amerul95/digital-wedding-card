"use client"

import React, { useState } from 'react'
import TextEditor from '@/components/textEditor/textEditor'

export default function page() {

  const [post ,setPost] = useState("")

  function onChange(value:string){
    setPost(value)
    console.log(value)
  }

  return (
    <div>
      <TextEditor post={post} onChange={onChange}/>
    </div>
  )
}
