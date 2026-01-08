"use client"

import React, { useRef, useState } from "react"
import { Upload, X, Image as ImageIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface IconUploadProps {
  label: string
  value?: string
  onChange: (url: string | undefined) => void
  onRemove: () => void
}

export function IconUpload({ label, value, onChange, onRemove }: IconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type - accept images and SVG
      const isImage = file.type.startsWith('image/')
      const isSVG = file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml'
      
      if (!isImage && !isSVG) {
        alert('Please select an image file (PNG, JPG, SVG, etc.)')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }

      // For SVG files, read as text to preserve SVG structure
      const reader = isSVG ? new FileReader() : new FileReader()
      
      if (isSVG) {
        reader.onload = (event) => {
          const svgText = event.target?.result as string
          // Convert SVG text to data URL
          const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgText)}`
          onChange(svgDataUrl)
        }
        reader.readAsText(file)
      } else {
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          onChange(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const isSVG = value?.startsWith('<svg') || value?.includes('data:image/svg+xml')
  const isImage = value && !isSVG && value.startsWith('data:image/')

  return (
    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">{label}</span>
        <button
          onClick={() => setShowInfoModal(true)}
          className="text-[9px] text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
          title="Icon format info"
        >
          ℹ️
        </button>
      </div>
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
        accept="image/*,.svg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Format Info */}
      {value && (
        <div className="text-[9px] text-gray-500 italic mt-1">
          {isSVG ? (
            <span className="text-blue-600">SVG format - Color can be changed</span>
          ) : isImage ? (
            <span className="text-gray-500">Image format - Fixed color</span>
          ) : null}
        </div>
      )}

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ℹ️ Icon Format Information</DialogTitle>
            <DialogDescription>
              Understanding SVG vs Image formats
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  SVG Format (Recommended)
                </h4>
                <ul className="text-xs text-blue-800 space-y-1 ml-6">
                  <li>• <strong>Can change color</strong> - Icon color adapts to theme</li>
                  <li>• <strong>Scalable</strong> - Looks perfect at any size</li>
                  <li>• <strong>Small file size</strong> - Fast loading</li>
                  <li>• <strong>File extension:</strong> .svg</li>
                </ul>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image Format (PNG, JPG, etc.)
                </h4>
                <ul className="text-xs text-gray-700 space-y-1 ml-6">
                  <li>• <strong>Fixed color</strong> - Color cannot be changed</li>
                  <li>• <strong>Best for:</strong> Custom designed icons with specific colors</li>
                  <li>• <strong>File extensions:</strong> .png, .jpg, .jpeg, .webp</li>
                  <li>• <strong>Recommendation:</strong> Use transparent PNG for best results</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="text-xs font-semibold text-green-900 mb-1">💡 Tip</h4>
                <p className="text-xs text-green-700">
                  For icons that should match your theme colors, use SVG format. For custom designed icons with specific colors, use PNG format with transparency.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


