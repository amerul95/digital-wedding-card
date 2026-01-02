"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useState } from 'react'
import TextEditor from '@/components/textEditor/textEditor'
import WeedingcardScaffold from '@/components/weddingcardScaffold'

import MultiForm from "@/components/forms/MultiForm"


export default function page() {

  const [post ,setPost] = useState("")

  function onChange(value:string){
    setPost(value)
    console.log(value)
  }

  return (
    <div>
      <MultiForm/>
      {/* <WeedingcardScaffold/> */}
    </div>
  )
}
