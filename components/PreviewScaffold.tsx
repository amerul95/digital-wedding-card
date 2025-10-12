import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImageCard({data}:{data:string}) {
  return (
    <Card className="w-[250px] overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img
          src="https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0"
          alt="Wedding Invitation"
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Wedding Invitation {data}
        </CardTitle>
      </CardContent>
    </Card>
  );
}


export default function PreviewScaffold() {

    const data = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
    ]

    const displayFour = data.slice(0,4)

  return (
    <div className='flex flex-wrap justify-center gap-6 p-6'>
        {displayFour.map((item,i) => (
          <ImageCard key={i} data={item}/>
        ))}
    </div>
  )
}
