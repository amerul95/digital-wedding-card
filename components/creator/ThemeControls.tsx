"use strict";
import React, { useRef } from 'react';
import { BackgroundStyle, BackgroundType } from './ThemeTypes';

interface ThemeControlsProps {
    label: string;
    value: BackgroundStyle;
    onChange: (style: BackgroundStyle) => void;
    className?: string; // To position it absolutely within the section
}

export function ThemeControls({ label, value, onChange, className = '' }: ThemeControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div className={`p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-rose-200 shadow-sm flex flex-col gap-2 z-50 ${className}`}>
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">{label}</span>

            <div className="flex gap-2">
                {/* Color Picker */}
                <div className="relative group">
                    <button
                        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                        title="Pick Color"
                        onClick={() => {
                            // If it's already a color, keep current value, else reset to white for picker
                            if (value.type !== 'color') {
                                onChange({ type: 'color', value: '#ffffff' });
                            }
                        }}
                    >
                        <div className="w-5 h-5 rounded-sm border border-gray-200" style={{ backgroundColor: value.type === 'color' ? value.value : '#fff' }} />
                    </button>
                    <input
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        value={value.type === 'color' ? value.value : '#ffffff'}
                        onChange={handleColorChange}
                    />
                </div>

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
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
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
            {value.type === 'image' && <span className="text-[10px] text-gray-500 truncate max-w-[6rem]">Image Set</span>}
        </div>
    );
}
