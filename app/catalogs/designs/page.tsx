import React from 'react'
import { FilterDesign } from '@/components/category/FilterDesign'
import { dataDummy } from '@/lib/dummyData'
import TableFiltered from '@/components/category/tableFiltered'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    color?: string
    category?: string
  }>
}) {
  // await the promise to get the actual object
  const { color, category } = await searchParams

  const filteredData = dataDummy.filter((item) => {
    const matchColor = color ? item.color === color : true
    const matchCategory = category ? item.category === category : true
    return matchColor && matchCategory
  })

  return (
    <div className="flex content-evenly w-full mt-24">
      <div className="w-1/3">
        <FilterDesign />
      </div>
      <div className="w-2/3 text-center">
        <TableFiltered filteredData = {filteredData}/>
      </div>
    </div>
  )
}
