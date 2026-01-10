"use client"

import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useSearchParams, usePathname, useRouter } from "next/navigation"

import { useDebouncedCallback } from '@/hooks/use-debounce';
import { dataDummy } from "@/lib/dummyData"

export function FilterDesign() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  // handle search 
  const handleFilterChange = useDebouncedCallback(
    (key: string, value: string) => {
      console.log(key)
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(key, value)
      } else {
        params.delete('color')
      }
      replace(`${pathname}?${params.toString()}`)
    }, 500
  )
  // ✅ Pre-fill current values
  const colorValue = searchParams.get("color") ?? ""
  const categoryValue = searchParams.get("category") ?? ""
  const searchValue = searchParams.get("search") ?? ""

  const colors = Array.from(new Set(dataDummy.map((item) => item.color)))
  const category = Array.from(new Set(dataDummy.map((categ) => categ.category)))

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Filter Your Design</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <SelectDetails
                label="Color"
                options={colors}
                defaultValue={colorValue}
                onSelect={(val) => handleFilterChange("color", val)} />
            </div>
            <div className="grid gap-2">
              <SelectDetails
                label="Category"
                options={category}
                defaultValue={categoryValue}
                onSelect={(val) => handleFilterChange("category", val)} />
            </div>
            <Search onSearch={(val) => handleFilterChange("search", val)} defaultValue={searchValue} />
          </div>
        </form>
        <Button className="max-w-24 mt-4 hover:cursor-pointer" onClick={() => replace(pathname)}>Reset Filter</Button>
      </CardContent>

    </Card>
  )
}

type SearchProps = {
  onSearch: (value: string) => void
  defaultValue: string
}
function Search({ onSearch, defaultValue }: SearchProps) {
  return (
    <div className="grid gap-2">
      <Input
        placeholder="Search Anything Here"
        onChange={(e) => { onSearch(e.target.value) }}
        defaultValue={defaultValue}
      />
    </div>
  )
}

type SelectDetailsProps = {
  label: string
  options: string[]
  onSelect?: (value: string) => void
  defaultValue?: string
}
export function SelectDetails({ label, options, onSelect, defaultValue }: SelectDetailsProps) {
  return (
    <Select onValueChange={(value) => onSelect?.(value)} defaultValue={defaultValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select a ${label.toLocaleLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((value) => (
            <SelectItem key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
