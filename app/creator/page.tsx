"use client"

import { useState } from "react"
import { CreatorCard } from "@/components/creator/CreatorCard"
import { defaultThemeConfig, ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes"
import Link from "next/link"

/**
 * Theme Creator Page
 * Allows users to customize wedding card themes with different background styles
 */
export default function CreatorPage() {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig)

  const updateConfig = (key: keyof ThemeConfig, style: BackgroundStyle) => {
    setConfig((prev) => ({
      ...prev,
      [key]: style,
    }))
  }

  const handleSaveTheme = () => {
    try {
      const themeJson = JSON.stringify(config, null, 2)
      console.log("Current Configuration:", themeJson)
      
      // Create a blob and download it
      const blob = new Blob([themeJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "theme-config.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error saving theme:", error)
      alert("Error saving theme configuration")
    }
  }

  return (
    <div className="min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#36463A]">Theme Creator</h1>
          <p className="mb-4 text-[#36463A]">
            Design your wedding card theme. Customize backgrounds for the card and each section.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-full border border-[#36463A] text-[#36463A] bg-white text-sm shadow hover:bg-gray-50 transition-colors"
              aria-label="Navigate back to home page"
            >
              Back to Home
            </Link>
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-[#36463A] text-white text-sm shadow hover:bg-[#2d3a2f] transition-colors"
              onClick={handleSaveTheme}
              aria-label="Save theme configuration as JSON file"
            >
              Save Theme JSON
            </button>
          </div>
        </header>

        <main className="flex justify-center" aria-label="Theme creator interface">
          <CreatorCard config={config} updateConfig={updateConfig} />
        </main>
      </div>
    </div>
  )
}
