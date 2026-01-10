"use strict";
import React, { useRef, useState } from 'react';
import { BackgroundStyle, BackgroundType } from './ThemeTypes';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ThemeControlsProps {
    label: string;
    value: BackgroundStyle;
    onChange: (style: BackgroundStyle) => void;
    className?: string; // To position it absolutely within the section
}

export function ThemeControls({ label, value, onChange, className = '' }: ThemeControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showGradientModal, setShowGradientModal] = useState(false);
    const [gradientColor1, setGradientColor1] = useState('#ff0000');
    const [gradientColor2, setGradientColor2] = useState('#0000ff');
    const [gradientDirection, setGradientDirection] = useState('to bottom');

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ type: 'color', value: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onChange({ type: 'image', value: imageUrl });
        }
    };

    const startImageUpload = () => {
        fileInputRef.current?.click();
    };

    const clearBackground = () => {
        onChange({ type: 'none', value: '' });
    };

    const handleApplyGradient = () => {
        const gradientValue = `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
        onChange({ type: 'gradient', value: gradientValue });
        setShowGradientModal(false);
    };

    // Get image sizing recommendation based on label
    const getImageSizingNote = () => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('card')) {
            return {
                aspectRatio: "4:9",
                examples: ["840×1890px", "1080×2430px", "1200×2700px"],
                note: "Match card aspect ratio for best results"
            };
        } else if (lowerLabel.includes('footer')) {
            return {
                aspectRatio: "3:1 (Landscape)",
                examples: ["840×280px", "1080×360px", "1200×400px"],
                note: "Wide horizontal format for footer"
            };
        } else if (lowerLabel.includes('section')) {
            return {
                aspectRatio: "4:9 or taller",
                examples: ["840×1890px", "840×2520px", "1080×2430px"],
                note: "Match card width, can be taller"
            };
        }
        return {
            aspectRatio: "4:9",
            examples: ["840×1890px"],
            note: "Match card aspect ratio"
        };
    };

    const sizingInfo = getImageSizingNote();

    return (
        <div className={`p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2 z-50 ${className}`}>
            <div className="flex items-center justify-between">
                <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-color-picker`} className="text-xs font-semibold text-rose-800 uppercase tracking-wider">{label}</label>
                {(label.toLowerCase().includes('bg') || label.toLowerCase().includes('section')) && (
                    <button
                        onClick={() => setShowSizeModal(true)}
                        className="text-[9px] text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                        title="Click for image size guide"
                    >
                        ℹ️
                    </button>
                )}
            </div>

            <div className="flex gap-2 flex-wrap">
                {/* Color Picker */}
                <div className="relative group">
                    <button
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                        title="Pick Color"
                        onClick={() => {
                            // If it's already a color, keep current value, else reset to white for picker
                            if (value.type !== 'color') {
                                onChange({ type: 'color', value: '#ffffff' });
                            }
                        }}
                    >
                        <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: value.type === 'color' ? value.value : '#fff' }} />
                    </button>
                    <input
                        id={`${label.toLowerCase().replace(/\s+/g, '-')}-color-picker`}
                        name={`${label.toLowerCase().replace(/\s+/g, '-')}-color-picker`}
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                        value={value.type === 'color' ? value.value : '#ffffff'}
                        onChange={handleColorChange}
                        style={{ WebkitAppearance: "none", appearance: "none" }}
                        aria-label={`${label} color picker`}
                    />
                </div>

                {/* Gradient Button */}
                <button
                    onClick={() => setShowGradientModal(true)}
                    className={`w-8 h-8 rounded border flex items-center justify-center text-gray-600 transition-colors ${
                        value.type === 'gradient'
                            ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    title="Pick Gradient"
                >
                    {value.type === 'gradient' ? (
                        <div className="w-5 h-5 rounded-sm border border-gray-200" style={{ background: value.value }} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                    )}
                </button>

                {/* Image Upload */}
                <button
                    onClick={startImageUpload}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                    title="Upload Image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </button>
                <input
                    id={`${label.toLowerCase().replace(/\s+/g, '-')}-file-upload`}
                    name={`${label.toLowerCase().replace(/\s+/g, '-')}-file-upload`}
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    aria-label={`${label} image upload`}
                />

                {/* Clear/None */}
                {value.type !== 'none' && (
                    <button
                        onClick={clearBackground}
                        className="w-8 h-8 rounded border border-red-200 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500"
                        title="Clear Background"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {value.type === 'color' && <span className="text-[10px] text-gray-500 font-mono">{value.value}</span>}
            {value.type === 'gradient' && (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-4 rounded border border-gray-200" style={{ background: value.value }} />
                    <span className="text-[10px] text-gray-500 truncate">Gradient</span>
                </div>
            )}
            {value.type === 'image' && (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 truncate max-w-[6rem]">Image Set</span>
                </div>
            )}

            {/* Size Info Modal */}
            <Dialog open={showSizeModal} onOpenChange={setShowSizeModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>📐 Image Size Guide - {label}</DialogTitle>
                        <DialogDescription>
                            Recommended image dimensions for best results
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                                <span className="text-sm font-semibold text-blue-900">Aspect Ratio:</span>
                                <span className="text-sm font-mono text-blue-700">{sizingInfo.aspectRatio}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <span className="text-sm font-semibold text-gray-700 block mb-2">Recommended Sizes:</span>
                                <ul className="space-y-1">
                                    {sizingInfo.examples.map((example, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 font-mono">• {example}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                                <span className="text-xs text-green-700 italic">{sizingInfo.note}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Gradient Picker Modal */}
            <Dialog open={showGradientModal} onOpenChange={setShowGradientModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>🎨 Create Gradient - {label}</DialogTitle>
                        <DialogDescription>
                            Choose two colors and direction for your gradient background
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-4">
                            {/* Color 1 */}
                            <div className="space-y-2">
                                <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color1-picker`} className="text-sm font-medium">Color 1 (Start)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color1-picker`}
                                        name={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color1-picker`}
                                        type="color"
                                        value={gradientColor1}
                                        onChange={(e) => setGradientColor1(e.target.value)}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
                                        style={{ WebkitAppearance: "none", appearance: "none" }}
                                    />
                                    <div className="flex-1">
                                        <input
                                            id={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color1-text`}
                                            name={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color1-text`}
                                            type="text"
                                            value={gradientColor1}
                                            onChange={(e) => setGradientColor1(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                            placeholder="#ff0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Color 2 */}
                            <div className="space-y-2">
                                <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color2-picker`} className="text-sm font-medium">Color 2 (End)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color2-picker`}
                                        name={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color2-picker`}
                                        type="color"
                                        value={gradientColor2}
                                        onChange={(e) => setGradientColor2(e.target.value)}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
                                        style={{ WebkitAppearance: "none", appearance: "none" }}
                                    />
                                    <div className="flex-1">
                                        <input
                                            id={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color2-text`}
                                            name={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-color2-text`}
                                            type="text"
                                            value={gradientColor2}
                                            onChange={(e) => setGradientColor2(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                            placeholder="#0000ff"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Direction */}
                            <div className="space-y-2">
                                <label htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-direction`} className="text-sm font-medium">Direction</label>
                                <select
                                    id={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-direction`}
                                    name={`${label.toLowerCase().replace(/\s+/g, '-')}-gradient-direction`}
                                    value={gradientDirection}
                                    onChange={(e) => setGradientDirection(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                >
                                    <option value="to bottom">Top to Bottom</option>
                                    <option value="to top">Bottom to Top</option>
                                    <option value="to right">Left to Right</option>
                                    <option value="to left">Right to Left</option>
                                    <option value="to bottom right">Top Left to Bottom Right</option>
                                    <option value="to top right">Bottom Left to Top Right</option>
                                    <option value="45deg">45° Diagonal</option>
                                    <option value="90deg">90° Vertical</option>
                                    <option value="135deg">135° Diagonal</option>
                                </select>
                            </div>

                            {/* Preview */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preview</label>
                                <div 
                                    className="w-full h-24 rounded border border-gray-300"
                                    style={{ background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowGradientModal(false)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApplyGradient}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Apply Gradient
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
