/**
 * Uploads tool details panel
 */

'use client';

import React, { useState, useRef } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { DESIGN_W, DESIGN_H, ImageObject } from '@/lib/store/types';

export function UploadsPanel() {
  const { currentSectionId, addObject } = useProjectStore();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImages((prev) => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setUploadedImages((prev) => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addImageToCanvas = (imageUrl: string) => {
    if (!currentSectionId) return;

    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxWidth = 400;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      const imageObject: Omit<ImageObject, 'id'> = {
        type: 'image',
        x: DESIGN_W / 2 - width / 2,
        y: DESIGN_H / 2 - height / 2,
        width,
        height,
        rotation: 0,
        locked: false,
        opacity: 1,
        hidden: false,
        src: imageUrl,
        fit: 'contain',
      };

      addObject(currentSectionId, imageObject);
    };
    img.src = imageUrl;
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Drag & Drop Area */}
      <div
        className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-zinc-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
        <p className="text-sm text-zinc-600 mb-1">Drag & drop images here</p>
        <p className="text-xs text-zinc-400">or click to browse</p>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Upload Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Images
      </Button>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
            Uploaded Images ({uploadedImages.length})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => addImageToCanvas(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-opacity z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && (
        <div className="text-center py-8 text-zinc-400 text-sm">
          No images uploaded yet
        </div>
      )}
    </div>
  );
}
