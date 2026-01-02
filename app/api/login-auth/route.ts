import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || ""

type BodyProps = {
    email:string;
    password:string
}

export async function POST(req:Request){
    // parse body 
    const body = await req.json() as BodyProps

    const token = jwt.sign(
        {email:body.email},JWT_SECRET,{expiresIn:"1h"}
    )

    ;(await cookies()).set({
        name:'accessToken',
        value:token,
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        path:"/",
        maxAge:60*60
    })
    
    return new Response(JSON.stringify({status:true}),{
        status:200,
        headers:{'Content-Type':'application/json'}
    })


}