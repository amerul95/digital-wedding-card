import React from 'react'

type Item = {
    id:number
    name:string
    color:string
    category:string
}

export default function TableFiltered({filteredData}:{filteredData:Item[]}) {
  return (
    <div>
        {filteredData.map((filter,i)=> (
            <div key={i}>
                {filter.category}
                {filter.name}
                {filter.color}
            </div>
        ))}
    </div>
  )
}
