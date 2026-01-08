"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  className,
  placeholder = "Select date and time",
}: DateTimePickerProps) {
  const [dateOpen, setDateOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [timeValue, setTimeValue] = React.useState("")
  const prevValueRef = React.useRef<string>("")

  // Parse the datetime-local value
  React.useEffect(() => {
    // Only update if value actually changed from outside
    if (value !== prevValueRef.current) {
      prevValueRef.current = value
      if (value) {
        try {
          const [datePart, timePart] = value.split("T")
          if (datePart) {
            const dateObj = new Date(datePart + (timePart ? `T${timePart}` : ""))
            if (!isNaN(dateObj.getTime())) {
              setDate(dateObj)
            }
          }
          if (timePart) {
            setTimeValue(timePart.substring(0, 5)) // Get HH:mm from HH:mm:ss
          } else {
            setTimeValue("")
          }
        } catch {
          setDate(undefined)
          setTimeValue("")
        }
      } else {
        setDate(undefined)
        setTimeValue("")
      }
    }
  }, [value])

  // Helper function to update parent value
  const updateValue = React.useCallback((newDate: Date | undefined, newTime: string) => {
    if (newDate) {
      const dateStr = newDate.toISOString().split("T")[0]
      const timeStr = newTime || "00:00"
      const newValue = `${dateStr}T${timeStr}`
      if (newValue !== prevValueRef.current) {
        prevValueRef.current = newValue
        onChange(newValue)
      }
    } else if (newTime) {
      // If only time is set, use today's date
      const today = new Date().toISOString().split("T")[0]
      const newValue = `${today}T${newTime}`
      if (newValue !== prevValueRef.current) {
        prevValueRef.current = newValue
        onChange(newValue)
      }
    }
  }, [onChange])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)
    updateValue(date, newTime)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setDateOpen(false)
    updateValue(selectedDate, timeValue)
  }

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-3 flex-1">
        <Label htmlFor="date-picker" className="px-1 text-sm font-medium text-gray-700">
          Date
        </Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white hover:bg-gray-50"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <Label htmlFor="time-picker" className="px-1 text-sm font-medium text-gray-700">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
        />
      </div>
    </div>
  )
}
