import { redirect } from "next/navigation"

export async function POST(req:Request){
    // parse body 
    const body = await req.json()
    console.log(body)
    return new Response(JSON.stringify({status:true}),{
        status:200,
        headers:{'Content-Type':'application/json'}
    })
}