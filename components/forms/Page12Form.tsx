"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react";
import { Trash2, Plus } from "lucide-react";

export function Page12Form() {
  const { event, updateEvent } = useEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageAdd = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });
    
    updateEvent({
      galleryImages: [...event.galleryImages, ...newImages],
    });
  };

  const handleImageRemove = (index: number) => {
    const newImages = event.galleryImages.filter((_, i) => i !== index);
    updateEvent({ galleryImages: newImages });
  };

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Image Gallery Settings - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Image Gallery Settings</Label>
          
          {/* Images List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Images</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-full bg-[#36463A] text-white text-xs shadow hover:bg-[#2d3a2f] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Images
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleImageAdd(e.target.files)}
            />
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {event.galleryImages.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border border-gray-300 rounded">
                  <img src={image} alt={`Gallery ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                  <span className="flex-1 text-xs text-gray-600 truncate">Image {index + 1}</span>
                  <button
                    onClick={() => handleImageRemove(index)}
                    className="p-1 rounded text-red-600 hover:bg-red-50"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {event.galleryImages.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No images added yet</p>
              )}
            </div>
          </div>

          {/* Slides Per View */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Slides Per View</label>
            <Input
              type="number"
              value={event.gallerySlidesPerView || 1}
              onChange={(e) => updateEvent({ gallerySlidesPerView: Math.max(1, parseInt(e.target.value) || 1) })}
              min="1"
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Number of images to show at once</p>
          </div>

          {/* Autoplay */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600">Autoplay</label>
            <Switch
              checked={event.galleryAutoplay ?? false}
              onCheckedChange={(checked) => updateEvent({ galleryAutoplay: checked })}
            />
          </div>

          {/* Container Width */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Container Width</label>
            <Select
              value={event.galleryContainerWidth || "full"}
              onValueChange={(value: "full" | "custom") => updateEvent({ galleryContainerWidth: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select width type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="custom">Custom Width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Width (only shown when custom is selected) */}
          {event.galleryContainerWidth === "custom" && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Custom Width (px)</label>
              <Input
                type="number"
                value={event.galleryCustomWidth || 300}
                onChange={(e) => updateEvent({ galleryCustomWidth: Math.max(100, parseInt(e.target.value) || 300) })}
                min="100"
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum: Container width</p>
            </div>
          )}

          {/* Enable Pagination */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600">Enable Pagination</label>
            <Switch
              checked={event.galleryEnablePagination ?? true}
              onCheckedChange={(checked) => updateEvent({ galleryEnablePagination: checked })}
            />
          </div>

          {/* Pagination Type (only shown when pagination is enabled) */}
          {event.galleryEnablePagination && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Pagination Type</label>
              <Select
                value={event.galleryPaginationType || "dot"}
                onValueChange={(value: "dot" | "number" | "none") => updateEvent({ galleryPaginationType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pagination type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
