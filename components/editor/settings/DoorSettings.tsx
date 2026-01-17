"use client";

import { useEditorStore } from "@/components/editor/store";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { useRef } from "react";
import { Palette, Layers, Box, Type, DoorOpen } from "lucide-react";

interface DoorSettingsProps {
    node: any;
    onUpdate: (data: any) => void;
}

const DOOR_STYLES = [
    { value: "swing", label: "Swing Doors" },
    { value: "slide", label: "Slide Doors" },
    { value: "envelope", label: "Envelope Doors" },
] as const;

export function DoorSettings({ node, onUpdate }: DoorSettingsProps) {
    const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDoorButtonTextChange = (html: string) => {
        if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
            onUpdate({ doorButtonText: html });
        }, 300);
    };

    return (
        <div className="flex flex-col gap-6">

            {/* === DOOR PROPERTIES SECTION === */}
            <div className="space-y-4 border rounded-lg p-3 bg-white shadow-sm">
                <h4 className="text-xs uppercase font-bold text-rose-600 flex items-center gap-2 border-b pb-2">
                    <DoorOpen size={14} /> Door Properties
                </h4>

                {/* Style Selection - Moved from Page Settings */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-700">Door Style</label>
                    <select
                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-rose-200 transition-colors"
                        value={node.data.doorStyle || 'swing'}
                        onChange={(e) => onUpdate({ doorStyle: e.target.value })}
                    >
                        {DOOR_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>

                {/* Appearance Sub-section */}
                <div className="space-y-3 pt-2">
                    <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Appearance</h5>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Door Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                className="h-8 w-8 cursor-pointer rounded border p-0"
                                value={node.data.doorColor || '#f43f5e'}
                                onChange={(e) => onUpdate({ doorColor: e.target.value })}
                            />
                            <input
                                type="text"
                                className="flex-1 text-xs border rounded px-2"
                                value={node.data.doorColor || '#f43f5e'}
                                onChange={(e) => onUpdate({ doorColor: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Opacity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range" min="0" max="100"
                                className="flex-1"
                                value={node.data.doorOpacity ?? 100}
                                onChange={(e) => onUpdate({ doorOpacity: parseInt(e.target.value) })}
                            />
                            <span className="text-xs w-8 text-right">{node.data.doorOpacity ?? 100}%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Blur</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range" min="0" max="100"
                                className="flex-1"
                                value={node.data.doorBlur ?? 0}
                                onChange={(e) => onUpdate({ doorBlur: parseInt(e.target.value) })}
                            />
                            <span className="text-xs w-8 text-right">{node.data.doorBlur ?? 0}px</span>
                        </div>
                    </div>
                </div>

                {/* Button Configuration Sub-section */}
                <div className="space-y-3 pt-2 border-t border-dashed">
                    <h5 className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Box size={12} /> Button Settings
                    </h5>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Text Content</label>
                        <RichTextEditorWithMargins
                            content={node.data.doorButtonText || ""}
                            onChange={handleDoorButtonTextChange}
                            placeholder="Enter button text..."
                            marginTop={node.data.doorButtonTextMarginTop}
                            marginRight={node.data.doorButtonTextMarginRight}
                            marginBottom={node.data.doorButtonTextMarginBottom}
                            marginLeft={node.data.doorButtonTextMarginLeft}
                            onMarginTopChange={(val) => onUpdate({ doorButtonTextMarginTop: val })}
                            onMarginRightChange={(val) => onUpdate({ doorButtonTextMarginRight: val })}
                            onMarginBottomChange={(val) => onUpdate({ doorButtonTextMarginBottom: val })}
                            onMarginLeftChange={(val) => onUpdate({ doorButtonTextMarginLeft: val })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Type</label>
                        <select
                            className="w-full text-xs border rounded p-1"
                            value={node.data.doorButtonType || ""}
                            onChange={(e) => onUpdate({ doorButtonType: e.target.value || undefined })}
                        >
                            <option value="">Auto</option>
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="rectangle">Rectangle</option>
                        </select>
                    </div>

                    {/* OPEN Text Settings */}
                    <div className="space-y-1 pt-2 border-t border-dashed">
                        <label className="text-[10px] font-semibold text-gray-500">OPEN Text</label>
                        <div className="space-y-1">
                            <label className="text-[9px] text-gray-400">Font Family</label>
                            <select
                                className="w-full text-xs border rounded p-1"
                                value={node.data.doorButtonOpenTextFontFamily || ''}
                                onChange={(e) => onUpdate({ doorButtonOpenTextFontFamily: e.target.value || undefined })}
                            >
                                <option value="">Default</option>
                                <option value="sans-serif">Sans Serif</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="cursive">Cursive</option>
                                <option value="fantasy">Fantasy</option>
                            </select>
                        </div>
                    </div>

                    {/* Compact Container/Style Settings */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[9px] text-gray-400">Pad X</label><input type="number" className="w-full text-xs border rounded px-1" value={node.data.doorButtonPaddingX ?? 24} onChange={(e) => onUpdate({ doorButtonPaddingX: parseInt(e.target.value) })} /></div>
                            <div><label className="text-[9px] text-gray-400">Pad Y</label><input type="number" className="w-full text-xs border rounded px-1" value={node.data.doorButtonPaddingY ?? 12} onChange={(e) => onUpdate({ doorButtonPaddingY: parseInt(e.target.value) })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[9px] text-gray-400">Radius</label><input type="number" className="w-full text-xs border rounded px-1" value={node.data.doorButtonBorderRadius ?? 9999} onChange={(e) => onUpdate({ doorButtonBorderRadius: parseInt(e.target.value) })} /></div>
                            <div>
                                <label className="text-[9px] text-gray-400">BG Color</label>
                                <div className="flex"><input type="color" className="w-full h-5 rounded" value={node.data.doorButtonBackgroundColor || '#ffffff'} onChange={(e) => onUpdate({ doorButtonBackgroundColor: e.target.value })} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
