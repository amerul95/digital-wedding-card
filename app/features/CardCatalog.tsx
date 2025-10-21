import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

type CardCatalogType = {
    title:string,
    description:string,
    image:string
    link:string
}

type CardCatalogProps = {
    data:CardCatalogType[]
}

export default function CardCatalog({data}:CardCatalogProps) {
  return (
    <div className='grid md:grid-cols-3 gap-2 grid-cols-1'>
        {data.length > 0 && data.map((item,i)=> (
    <Card className='max-w-md pt-0' key={i}>
      <CardContent className='px-0'>
        <Image
          src={`${item.image}`}
          alt='Banner'
          className='aspect-video h-70 rounded-t-xl object-cover'
          width={700}
          height={70}
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
        <Link href={`/catalogs/${item.link}`}>
            <Button className='hover:cursor-pointer'>Explore More</Button>
        </Link>
      </CardFooter>
    </Card>
        ))}
    </div>

  )
}
