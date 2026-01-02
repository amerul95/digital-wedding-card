import React from 'react'

export default function FootersLayout() {
  return (
    <div>
      <FirstRow/>
      <SecondRow/>
    </div>
  )
}

function FirstRow(){

    const data = [
        {
            title:"CORPORATE",
            item: [
                "ABOUT US",
                "BLOG",
                "CAREERS"
            ]
        },
        {
            title:"JOIN US",
            item: [
                "PARTNER PROGRAM",
                "BECOME OUT VENDOR",
            ]
        },
        {
            title:"FOR DESIGNER",
            item: [
                "DESIGNER ESSENTIALS",
                "DESIGNER KIT",
                "DESIGN CHALLENGES",
                "I'M A DESIGNER"
            ]
        },
        {
            title:"CUSTOMER CARE",
            item: [
                "GET SIMPLE KIT",
                "KNOWLEDGE BASE",
                "CONTACT US"
            ]
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 text-sm text-gray-700">
            {data.map((section,i)=> (
            <div className="flex flex-col space-y-2" key={i}>
                <p className="font-semibold text-gray-900 mb-2">{section.title}</p>
                <div className="flex flex-col space-y-1">
                {section.item.map((item,j)=>(
                    <a href="#" key={j} className="hover:text-pink-500 transition-colors">
                       {item}
                    </a>
                ))}
                </div>
            </div>
            ))}
        </div>
    )
}
function SecondRow(){

    const data = [
        {
            text:"TERMS",
            link:"#",
            image:"#"
        },
        {
            text:"PRIVACY",
            link:"#",
            image:"#"
        },
        {
            text:"COOKIES",
            link:"#",
            image:"#"
        },
        {
            text:"FACEBOOKS",
            link:"#",
            image:"#"
        },
        {
            text:"TWITTERS",
            link:"#",
            image:"#"
        },
        {
            text:"INSTAGRAM",
            link:"#",
            image:"#"
        },
    ]

    return (
        <div className='flex justify-between'>
            <div>
                <p>All Rights Reserved. © 2025 POLYGOT</p>
            </div>
            <div className='flex'>
                {data.map((item,i)=>(
                    <div key={i}>{item.text}</div>
                ))}
            </div>
        </div>
    )
}
