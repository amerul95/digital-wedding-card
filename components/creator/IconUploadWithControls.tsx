"use client"

import React, { useRef, useState } from "react"
import { Upload, X, GripVertical, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FooterIconConfig } from "./ThemeTypes"

interface IconUploadWithControlsProps {
  label: string
  iconKey: 'calendar' | 'phone' | 'pin' | 'rsvp' | 'gifts'
  value?: string | FooterIconConfig
  order: number
  visible: boolean
  onChange: (config: FooterIconConfig) => void
  onRemove: () => void
  onOrderChange: (newOrder: number) => void
  onVisibilityChange: (visible: boolean) => void
  isDragging?: boolean
  dragHandleProps?: any
}

export function IconUploadWithControls({ 
  label, 
  iconKey,
  value, 
  order,
  visible,
  onChange, 
  onRemove,
  onOrderChange,
  onVisibilityChange,
  isDragging,
  dragHandleProps
}: IconUploadWithControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)

  // Normalize value to FooterIconConfig format
  const iconConfig: FooterIconConfig = typeof value === 'string' 
    ? { url: value, visible: true, order, customLabel: undefined }
    : { 
        url: value?.url, 
        visible: value?.visible ?? true, 
        order: value?.order ?? order,
        customLabel: value?.customLabel // Preserve customLabel, including empty string
      }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isImage = file.type.startsWith('image/')
      const isSVG = file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml'
      
      if (!isImage && !isSVG) {
        alert('Please select an image file (PNG, JPG, SVG, etc.)')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }

      const reader = isSVG ? new FileReader() : new FileReader()
      
      if (isSVG) {
        reader.onload = (event) => {
          const svgText = event.target?.result as string
          const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgText)}`
          onChange({ ...iconConfig, url: svgDataUrl })
        }
        reader.readAsText(file)
      } else {
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          onChange({ ...iconConfig, url: dataUrl })
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const isSVG = iconConfig.url?.startsWith('<svg') || iconConfig.url?.includes('data:image/svg+xml')
  const isImage = iconConfig.url && !isSVG && iconConfig.url.startsWith('data:image/')

  return (
    <div 
      className={`p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2 transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div 
          {...dragHandleProps}
          className="cursor-move text-gray-400 hover:text-gray-600 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Order Number */}
        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
          {order}
        </div>

        <div className="flex items-center justify-between flex-1">
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">{label}</span>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-[9px] text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
            title="Icon format info"
          >
            ℹ️
          </button>
        </div>
      </div>

      {/* Custom Label Input */}
      <div className="space-y-1">
        <Label htmlFor={`${iconKey}-label`} className="text-[10px] text-gray-600">
          Icon Label
        </Label>
        <Input
          id={`${iconKey}-label`}
          type="text"
          value={iconConfig.customLabel !== undefined ? iconConfig.customLabel : ''}
          onChange={(e) => {
            const newValue = e.target.value;
            // If empty, set to empty string (will hide label)
            // If user types something, set it as customLabel
            onChange({ 
              ...iconConfig, 
              customLabel: newValue === '' ? '' : newValue 
            });
          }}
          placeholder={label}
          className="h-7 text-xs"
        />
        <p className="text-[9px] text-gray-400 italic">Default: {label}. Leave empty to hide label.</p>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor={`${iconKey}-visibility`} className="text-[10px] text-gray-600">
          Show in card
        </Label>
        <Switch
          id={`${iconKey}-visibility`}
          checked={visible}
          onCheckedChange={onVisibilityChange}
        />
      </div>

      {iconConfig.url ? (
        <div className="flex items-center gap-2">
          <img src={iconConfig.url} alt={label} className="w-8 h-8 object-contain rounded border border-gray-200" />
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

      {iconConfig.url && (
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
                <h4 className="text-sm font-semibold text-blue-900 mb-2">SVG Format (Recommended)</h4>
                <ul className="text-xs text-blue-800 space-y-1 ml-6">
                  <li>• <strong>Can change color</strong> - Icon color adapts to theme</li>
                  <li>• <strong>Scalable</strong> - Looks perfect at any size</li>
                  <li>• <strong>Small file size</strong> - Fast loading</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Image Format (PNG, JPG, etc.)</h4>
                <ul className="text-xs text-gray-700 space-y-1 ml-6">
                  <li>• <strong>Fixed color</strong> - Color cannot be changed</li>
                  <li>• <strong>Best for:</strong> Custom designed icons with specific colors</li>
                  <li>• <strong>Recommendation:</strong> Use transparent PNG for best results</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
