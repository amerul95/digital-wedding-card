import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server'

const protectedRoute = '/cart'

export function middleware(req:NextRequest){
    
    const token = req.cookies.get('accessToken')?.value
    const url = req.nextUrl.pathname

    if(url === protectedRoute){
        if(!token){
            const loginUrl = new URL('/login',req.url)

            loginUrl.searchParams.set('redirect',req.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }
    }
}

export const config = { 
    matcher:['/cart']
}