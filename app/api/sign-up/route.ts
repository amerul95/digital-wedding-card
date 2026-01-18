import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';


const JWT_SECRET = process.env.JWT_SECRET || ""

type BodyProps = {
    email:string;
    password:string
}
const SchemaSignUpForm = z.object({
    email:z.email({message:"Please enter valid email"}).min(2,{
        message:"email is required"
    }),
    password:z.string().min(2,{
        message:"password is required"
    }),
})
export async function POST(req:Request){
    // parse body 
    try {
    const body = await req.json() as BodyProps
    const parsed = SchemaSignUpForm.safeParse(body)
    if(!parsed.success){
        return NextResponse.json(
            {error:parsed.error.flatten().fieldErrors},
            {status:400}
        )
    }

    const {email,password} = parsed.data

    // check for existing user
    const existingUser = await prisma.user.findUnique({
        where: {email}
    })

    if(existingUser){
        return NextResponse.json(
            {error:"User already exist with this email"},
            {status:409}
        )
    }
    // hashpassword
    const hashedPassword = await bcrypt.hash(password,10)

    // Get or create client role (or leave null for default client)
    let clientRole = await prisma.role.findUnique({
      where: { name: "client" }
    })

    if (!clientRole) {
      clientRole = await prisma.role.create({
        data: { name: "client" }
      })
    }

    // create user
    const user = await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            roleId: clientRole.id, // Keep for backward compatibility
            roles: {
              create: {
                roleId: clientRole.id
              }
            }
        }
    })

    // optional remove before returning
    const {password:_, ...safeUser} = user

    const token = jwt.sign(
        {id: user.id, email:user.email, role: "client"},JWT_SECRET,{expiresIn:"7d"}
    )

    // Use client cookie name
    ;(await cookies()).set({
        name:'next-auth.session-token.client',
        value:token,
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        path:"/",
        maxAge:60*60*24*7, // 7 days
        sameSite: "lax"
    })
    
    return NextResponse.json(
        {message:"User Created successfully"},
        {status:201}
    )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error:"Internal server error"},
            {status:500}
        )
    }



}