"use client"

import React, { useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IconUploadProps {
  label: string
  value?: string
  onChange: (url: string | undefined) => void
  onRemove: () => void
}

export function IconUpload({ label, value, onChange, onRemove }: IconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB')
        return
      }

      // Convert to data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        onChange(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2">
      <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">{label}</span>
      {value ? (
        <div className="flex items-center gap-2">
          <img src={value} alt={label} className="w-8 h-8 object-contain rounded border border-gray-200" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="h-8 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-full"
        >
          <Upload className="h-3 w-3 mr-1" />
          Upload
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

