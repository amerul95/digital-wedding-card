"use client";

import { useEditorStore } from "@/components/editor/store";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Copy, Plus, Trash2, Upload, Settings, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Layout, Square, GripVertical, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DoorSettings } from "@/components/editor/settings/DoorSettings";
import { AnimationSettings } from "@/components/editor/settings/AnimationSettings";
import React, { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

// --- Helper Components for Property Panel ---

interface BorderValues {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    topColor?: string;
    rightColor?: string;
    bottomColor?: string;
    leftColor?: string;
    style?: string;
}

const BorderControl = ({
    label,
    prefix,
    data,
    onChange,
    values,
    onValuesChange
}: {
    label: string,
    prefix?: string,
    data?: any,
    onChange?: (key: string, val: string) => void,
    values?: BorderValues,
    onValuesChange?: (vals: BorderValues) => void
}) => {

    const getValue = (key: keyof BorderValues, suffix: string) => {
        if (values) return values[key];
        if (data && prefix) return data[`${prefix}${suffix}`];
        return '';
    };

    const handleUpdate = (key: keyof BorderValues, suffix: string, val: string) => {
        if (values && onValuesChange) {
            onValuesChange({ ...values, [key]: val });
        } else if (onChange && prefix) {
            onChange(`${prefix}${suffix}`, val);
        }
    };

    return (
        <div className="flex flex-col gap-2 border-t pt-2 mt-2">
            <h4 className="text-[10px] uppercase font-semibold text-gray-500 flex items-center gap-1">
                {label}
            </h4>
            {/* Widths */}
            <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-400">Widths (T/R/B/L)</label>
                <div className="grid grid-cols-4 gap-1">
                    {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                        const key = side.toLowerCase() as keyof BorderValues;
                        return (
                            <input
                                key={side}
                                type="text"
                                placeholder="0px"
                                className="border rounded p-1 text-[10px] text-center"
                                title={`Border Width ${side}`}
                                value={getValue(key, `${side}Width`) || ''}
                                onChange={(e) => handleUpdate(key, `${side}Width`, e.target.value)}
                            />
                        );
                    })}
                </div>
            </div>
            {/* Colors */}
            <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-400">Colors (T/R/B/L)</label>
                <div className="grid grid-cols-4 gap-1">
                    {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                        const key = `${side.toLowerCase()}Color` as keyof BorderValues;
                        return (
                            <div key={side} className="relative group">
                                <input
                                    type="color"
                                    className="w-full h-6 border rounded cursor-pointer"
                                    title={`Border Color ${side}`}
                                    value={getValue(key, `${side}Color`) || '#000000'}
                                    onChange={(e) => handleUpdate(key, `${side}Color`, e.target.value)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Style */}
            <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-400">Style</label>
                <select
                    className="border rounded p-1 text-xs"
                    value={values?.style || (data && prefix ? data[`${prefix}Style`] : '') || 'solid'}
                    onChange={(e) => handleUpdate('style', 'Style', e.target.value)}
                >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                </select>
            </div>
        </div>
    );
};

const RadiusControl = ({ data, onChange }: { data: any, onChange: (key: string, val: string) => void }) => {
    return (
        <div className="flex flex-col gap-1 mt-2">
            <label className="text-[10px] text-gray-500 font-semibold">Corner Radius (TL/TR/BL/BR)</label>
            <div className="grid grid-cols-4 gap-1">
                {['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'].map((corner) => (
                    <input
                        key={corner}
                        type="text"
                        placeholder="0px"
                        className="border rounded p-1 text-[10px] text-center"
                        title={`Border Radius ${corner}`}
                        value={data[`borderRadius${corner}`] || ''}
                        onChange={(e) => onChange(`borderRadius${corner}`, e.target.value)}
                    />
                ))}
            </div>
        </div>
    );
};

const DisplayControl = ({ data, onChange }: { data: any, onChange: (key: string, val: string) => void }) => {
    return (
        <div className="flex flex-col gap-2 border-t pt-2 mt-2">
            <h4 className="text-[10px] uppercase font-semibold text-gray-500 flex items-center gap-1">
                <Layout size={10} /> Layout
            </h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400">Display</label>
                    <select
                        className="border rounded p-1 text-xs"
                        value={data.display || 'block'}
                        onChange={(e) => onChange('display', e.target.value)}
                    >
                        <option value="block">Block</option>
                        <option value="flex">Flex</option>
                        <option value="grid">Grid</option>
                    </select>
                </div>
                {data.display === 'flex' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-gray-400">Direction</label>
                        <select
                            className="border rounded p-1 text-xs"
                            value={data.flexDirection || 'row'}
                            onChange={(e) => onChange('flexDirection', e.target.value)}
                        >
                            <option value="row">Row</option>
                            <option value="column">Column</option>
                            <option value="row-reverse">Row Rev</option>
                            <option value="column-reverse">Col Rev</option>
                        </select>
                    </div>
                )}
                {data.display === 'grid' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-gray-400">Columns</label>
                        <input
                            type="text"
                            className="border rounded p-1 text-xs"
                            placeholder="1fr 1fr"
                            value={data.gridTemplateColumns || ''}
                            onChange={(e) => onChange('gridTemplateColumns', e.target.value)}
                        />
                    </div>
                )}
            </div>
            {(data.display === 'flex' || data.display === 'grid') && (
                <>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-gray-400">Gap</label>
                            <input
                                type="text"
                                className="border rounded p-1 text-xs"
                                placeholder="0px"
                                value={data.gap || ''}
                                onChange={(e) => onChange('gap', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-gray-400">Justify Content</label>
                            <select
                                className="border rounded p-1 text-xs"
                                value={data.justifyContent || 'flex-start'}
                                onChange={(e) => onChange('justifyContent', e.target.value)}
                            >
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                                <option value="space-between">Space Btwn</option>
                                <option value="space-around">Space Arnd</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-gray-400">Align Items</label>
                            <select
                                className="border rounded p-1 text-xs"
                                value={data.alignItems || 'stretch'}
                                onChange={(e) => onChange('alignItems', e.target.value)}
                            >
                                <option value="stretch">Stretch</option>
                                <option value="flex-start">Start</option>
                                <option value="center">Center</option>
                                <option value="flex-end">End</option>
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// --- Bottom Nav Sortable Item ---

function SortableNavItem({ item, onRemove, onUpdate, isExpanded, onToggleExpand }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border rounded mb-2 overflow-hidden shadow-sm">
            <div className="flex items-center p-2 gap-2 bg-gray-50 border-b">
                <button {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                    <GripVertical size={14} />
                </button>
                <div
                    className="flex-1 text-xs font-medium cursor-pointer"
                    onClick={onToggleExpand}
                >
                    {item.label || 'New Item'} <span className="text-[10px] text-gray-400 font-normal">({item.type})</span>
                </div>
                <button onClick={onToggleExpand} className="text-gray-400">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                </button>
            </div>

            {isExpanded && (
                <div className="p-3 space-y-3 bg-white">
                    {/* Basic Config */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Label</label>
                            <input
                                type="text"
                                className="border rounded p-1 text-xs"
                                value={item.label}
                                onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Function Type</label>
                            <select
                                className="border rounded p-1 text-xs"
                                value={item.type}
                                onChange={(e) => onUpdate(item.id, { type: e.target.value })}
                            >
                                <option value="home">Home</option>
                                <option value="calendar">Date</option>
                                <option value="contact">Contact</option>
                                <option value="video">Video</option>
                                <option value="map">Location</option>
                                <option value="gift">Gift</option>
                                <option value="rsvp">RSVP</option>
                            </select>
                        </div>
                    </div>

                    {/* Icon Config */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Icon Type</label>
                        <div className="flex gap-2 text-xs">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={item.iconType === 'default'}
                                    onChange={() => onUpdate(item.id, { iconType: 'default' })}
                                /> Default
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={item.iconType === 'custom'}
                                    onChange={() => onUpdate(item.id, { iconType: 'custom' })}
                                /> Upload
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={item.iconType === 'text'}
                                    onChange={() => onUpdate(item.id, { iconType: 'text' })}
                                /> Text
                            </label>
                        </div>
                    </div>

                    {item.iconType === 'default' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Select Icon</label>
                            <select className="border rounded p-1 text-xs" value={item.icon} onChange={(e) => onUpdate(item.id, { icon: e.target.value })}>
                                <option value="home">Home</option>
                                <option value="calendar">Calendar</option>
                                <option value="phone">Phone</option>
                                <option value="message">Message</option>
                                <option value="image">Image</option>
                                <option value="map">Map Pin</option>
                                <option value="video">Video</option>
                                <option value="gift">Gift</option>
                                <option value="rsvp">Mail</option>
                            </select>
                        </div>
                    )}

                    {item.iconType === 'custom' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500">Custom Icon URL</label>
                            <input type="text" className="border rounded p-1 text-xs mb-1" placeholder="https://..." value={item.customIcon || ''} onChange={(e) => onUpdate(item.id, { customIcon: e.target.value })} />
                            <input type="file" accept="image/*" className="text-xs" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onUpdate(item.id, { customIcon: URL.createObjectURL(file) });
                            }} />
                        </div>
                    )}

                    {item.iconType === 'text' && (
                        <div className="space-y-2 border-l-2 pl-2 border-gray-100">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Text Content</label>
                                <input type="text" className="border rounded p-1 text-xs" value={item.textIconContent || ''} onChange={(e) => onUpdate(item.id, { textIconContent: e.target.value })} placeholder="Ab" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" className="border rounded p-1 text-xs" placeholder="Font Family" value={item.textIconFontFamily || ''} onChange={(e) => onUpdate(item.id, { textIconFontFamily: e.target.value })} />
                                <input type="color" className="border rounded w-full h-6" value={item.textIconColor || '#000000'} onChange={(e) => onUpdate(item.id, { textIconColor: e.target.value })} />
                            </div>
                        </div>
                    )}


                    {/* Specific Data inputs based on Type */}
                    <div className="border-t pt-2">
                        <h5 className="text-[10px] font-semibold text-gray-500 uppercase mb-2">{item.type} Configuration</h5>

                        {item.type === 'contact' && (
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500">Contacts (Name:Phone)</label>
                                {(item.contactList || []).map((contact: any, idx: number) => (
                                    <div key={idx} className="flex gap-1">
                                        <input type="text" placeholder="Name" className="border p-1 w-1/3 text-xs" value={contact.name} onChange={(e) => {
                                            const newList = [...(item.contactList || [])];
                                            newList[idx].name = e.target.value;
                                            onUpdate(item.id, { contactList: newList });
                                        }} />
                                        <input type="text" placeholder="Phone" className="border p-1 w-1/2 text-xs" value={contact.phone} onChange={(e) => {
                                            const newList = [...(item.contactList || [])];
                                            newList[idx].phone = e.target.value;
                                            onUpdate(item.id, { contactList: newList });
                                        }} />
                                        <button onClick={() => {
                                            const newList = (item.contactList || []).filter((_: any, i: number) => i !== idx);
                                            onUpdate(item.id, { contactList: newList });
                                        }} className="text-red-400"><X size={12} /></button>
                                    </div>
                                ))}
                                <button onClick={() => onUpdate(item.id, { contactList: [...(item.contactList || []), { name: '', phone: '' }] })} className="text-[10px] text-blue-500 flex items-center gap-1">
                                    <Plus size={10} /> Add Contact
                                </button>
                            </div>
                        )}

                        {/* Video URL input removed - controlled by Global Settings now */}

                        {item.type === 'map' && (
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Location Address</label>
                                <textarea className="border rounded p-1 text-xs" rows={2} value={item.locationAddress || ''} onChange={(e) => onUpdate(item.id, { locationAddress: e.target.value })} />
                            </div>
                        )}

                        {item.type === 'gift' && (
                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-500">Bank Name</label>
                                    <input type="text" className="border rounded p-1 text-xs" value={item.giftBankName || ''} onChange={(e) => onUpdate(item.id, { giftBankName: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-500">Account Number</label>
                                    <input type="text" className="border rounded p-1 text-xs" value={item.giftAccountNumber || ''} onChange={(e) => onUpdate(item.id, { giftAccountNumber: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-500">Account Owner</label>
                                    <input type="text" className="border rounded p-1 text-xs" value={item.giftAccountName || ''} onChange={(e) => onUpdate(item.id, { giftAccountName: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-gray-500">QR Code Image</label>
                                    <input type="file" accept="image/*" className="text-xs" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onUpdate(item.id, { giftQrImage: URL.createObjectURL(file) });
                                    }} />
                                    {item.giftQrImage && <p className="text-[9px] text-green-600">Image Uploaded</p>}
                                </div>
                            </div>
                        )}

                        {item.type === 'rsvp' && (
                            <p className="text-[10px] text-gray-400 italic">No specific configuration needed. Uses default RSVP form.</p>
                        )}

                        {(item.type === 'home' || item.type === 'calendar') && (
                            <p className="text-[10px] text-gray-400 italic">Standard Action.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const defaultNavbarItems = [
    { id: '1', type: 'home', label: 'Home', icon: 'home', iconType: 'default', visible: true },
    { id: '2', type: 'calendar', label: 'Date', icon: 'calendar', iconType: 'default', visible: true },
    { id: '3', type: 'contact', label: 'Contact', icon: 'phone', iconType: 'default', visible: true },
    { id: '4', type: 'gift', label: 'Gift', icon: 'gift', iconType: 'default', visible: true },
];

function BottomNavSettings({ node, updateNodeData }: { node: any, updateNodeData: any }) {
    const items = node.data.items || defaultNavbarItems;
    const navStyle = node.data.style || {};
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item: any) => item.id === active.id);
            const newIndex = items.findIndex((item: any) => item.id === over?.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            updateNodeData(node.id, { items: newItems });
        }
    };

    const handleAddItem = () => {
        const newItem = {
            id: `item-${Date.now()}`,
            type: 'home',
            label: 'New',
            icon: 'home',
            iconType: 'default',
            visible: true
        };
        updateNodeData(node.id, { items: [...items, newItem] });
        setExpandedItem(newItem.id);
    };

    const handleRemoveItem = (id: string) => {
        updateNodeData(node.id, { items: items.filter((i: any) => i.id !== id) });
    };

    const handleUpdateItem = (id: string, updates: any) => {
        updateNodeData(node.id, {
            items: items.map((i: any) => i.id === id ? { ...i, ...updates } : i)
        });
    };

    const updateStyle = (key: string, value: any) => {
        updateNodeData(node.id, { style: { ...navStyle, [key]: value } });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                <Settings size={12} /> Bottom Navigation
            </h3>

            {/* Container Layout */}
            <div className="bg-gray-50 p-3 rounded space-y-3">
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase">Container Styling</h4>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Layout Mode</label>
                    <select
                        className="border rounded p-1 text-xs bg-white"
                        value={node.data.layoutType || 'float'}
                        onChange={(e) => updateNodeData(node.id, { layoutType: e.target.value })}
                    >
                        <option value="float">Floating (Overlay)</option>
                        <option value="full">Full Width</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Height</label>
                        <input type="text" className="border rounded p-1 text-xs" placeholder="64px" value={navStyle.height || ''} onChange={(e) => updateStyle('height', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500">Bottom Pos (Y)</label>
                        <input type="text" className="border rounded p-1 text-xs" placeholder="16px" value={navStyle.bottomPosition || ''} onChange={(e) => updateStyle('bottomPosition', e.target.value)} />
                    </div>
                </div>
                {/* Border Radius */}
                <div>
                    <label className="text-[10px] text-gray-500 mb-1 block">Border Radius (TL/TR/BL/BR)</label>
                    <div className="grid grid-cols-4 gap-1">
                        {['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'].map(corner => (
                            <input
                                key={corner}
                                type="text"
                                className="border rounded p-1 text-[10px] text-center"
                                placeholder="0"
                                value={navStyle[`borderRadius${corner}`] || ''}
                                onChange={(e) => updateStyle(`borderRadius${corner}`, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Items Management */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-semibold text-gray-400 uppercase">Menu Items</h4>
                    <button onClick={handleAddItem} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                        <Plus size={12} /> Add Item
                    </button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                        {items.map((item: any) => (
                            <SortableNavItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveItem}
                                onUpdate={handleUpdateItem}
                                isExpanded={expandedItem === item.id}
                                onToggleExpand={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

interface PropertyPanelProps {
    isOpen: boolean;
}

export function PropertyPanel({ isOpen }: PropertyPanelProps) {
    const selectedId = useEditorStore((state) => state.selectedId);
    const rootId = useEditorStore((state) => state.rootId);
    const targetId = selectedId || null;
    const node = useEditorStore((state) => targetId ? state.nodes[targetId] : null);

    const updateNodeData = useEditorStore((state) => state.updateNodeData);
    const updateNodeStyle = useEditorStore((state) => state.updateNodeStyle);
    const updateNodeAnimation = useEditorStore((state) => state.updateNodeAnimation);
    const removeNode = useEditorStore((state) => state.removeNode);

    // Special case: Show only animation settings
    if (targetId === 'animation-settings') {
        return (
            <div className={cn(
                "border-l bg-white flex flex-col h-full shadow-xl z-20 transition-all duration-300",
                isOpen ? "w-80" : "w-0 overflow-hidden border-none"
            )}>
                {isOpen && (
                    <>
                        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                            <h2 className="font-semibold text-sm uppercase tracking-wider">Animation Properties</h2>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 space-y-6">
                            <AnimationSettings />
                        </div>
                    </>
                )}
            </div>
        );
    }

    if (!targetId || !node) {
        return (
            <div className={cn(
                "border-l bg-white p-4 h-full transition-all duration-300",
                isOpen ? "w-80" : "w-0 overflow-hidden border-none p-0"
            )}>
                {isOpen && (
                    <div className="text-gray-400 text-sm text-center mt-10">
                        Select an element to edit
                    </div>
                )}
            </div>
        );
    }

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateNodeStyle(targetId, { backgroundImage: url });
        }
    };

    const handleStyleChange = (key: string, value: string) => {
        updateNodeStyle(targetId, { [key]: value });
    };

    return (
        <div className={cn(
            "border-l bg-white flex flex-col h-full shadow-xl z-20 transition-all duration-300",
            isOpen ? "w-80" : "w-0 overflow-hidden border-none"
        )}>
            {isOpen && (
                <>
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                        <h2 className="font-semibold text-sm uppercase tracking-wider">{node.type} Properties</h2>
                        {node.type !== 'root' && (
                            <button
                                onClick={() => removeNode(targetId)}
                                className="text-red-500 hover:bg-red-50 p-1 rounded"
                                title="Delete Widget"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="p-4 overflow-y-auto flex-1 space-y-6">
                        {/* === BOTTOM NAV WIDGET SETTINGS === */}
                        {node.type === 'bottom-nav' && (
                            <BottomNavSettings node={node} updateNodeData={updateNodeData} />
                        )}

                        {/* === CONTENT SETTINGS === */}
                        {node.type !== 'bottom-nav' && (
                            <div className="space-y-3">
                                {/* Text Widget Specifics */}
                                {node.type === 'text' && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">Content</label>
                                    <RichTextEditor
                                        content={node.data.content || ''}
                                        onChange={(html) => updateNodeData(targetId, { content: html })}
                                        fontSize={parseInt(node.style.fontSize) || 16}
                                        onFontSizeChange={(size) => updateNodeStyle(targetId, { fontSize: `${size}px` })}
                                        fontColor={node.style.color || '#000000'}
                                        onFontColorChange={(color) => updateNodeStyle(targetId, { color })}
                                        placeholder="Enter text..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-600">Alignment (Wrapper)</label>
                                        <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
                                            {['left', 'center', 'right', 'justify'].map((align) => (
                                                <button
                                                    key={align}
                                                    className={`p-1 rounded ${node.style.textAlign === align ? 'bg-white shadow' : 'text-gray-400'}`}
                                                    onClick={() => updateNodeStyle(targetId, { textAlign: align })}
                                                    title={align}
                                                >
                                                    {align === 'left' && <AlignLeft size={14} />}
                                                    {align === 'center' && <AlignCenter size={14} />}
                                                    {align === 'right' && <AlignRight size={14} />}
                                                    {align === 'justify' && <AlignJustify size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-600">Font Family</label>
                                        <select
                                            className="border rounded p-2 text-sm"
                                            value={node.style.fontFamily || 'sans'}
                                            onChange={(e) => updateNodeStyle(targetId, { fontFamily: e.target.value })}
                                        >
                                            <option value="sans">Sans Serif</option>
                                            <option value="serif">Serif</option>
                                            <option value="mono">Monospace</option>
                                            <option value="cursive">Cursive</option>
                                            <option value="fantasy">Fantasy</option>
                                        </select>
                                    </div>
                                </div>
                                )}

                                {/* Button Widget Specifics */}
                                {node.type === 'button' && (
                                    <div className="flex flex-col gap-3">
                                        {/* General Label / Display */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">General</label>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs text-gray-600">Display Type</label>
                                                <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
                                                    {[
                                                        { id: 'text', label: 'Text' },
                                                        { id: 'icon', label: 'Icon' },
                                                        { id: 'both', label: 'Both' }
                                                    ].map((mode) => (
                                                        <button
                                                            key={mode.id}
                                                            className={`px-2 py-1 text-[10px] rounded ${node.data.displayType === mode.id || (!node.data.displayType && mode.id === 'text') ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                                            onClick={() => updateNodeData(targetId, { displayType: mode.id })}
                                                        >
                                                            {mode.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {(node.data.displayType !== 'icon') && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs text-gray-600">Label</label>
                                                    <input
                                                        type="text"
                                                        className="border rounded p-2 text-sm w-full"
                                                        value={node.data.label || ''}
                                                        onChange={(e) => updateNodeData(targetId, { label: e.target.value })}
                                                        placeholder="Button Text"
                                                    />
                                                </div>
                                            )}

                                            {(node.data.displayType === 'icon' || node.data.displayType === 'both') && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs text-gray-600">Icon</label>
                                                    <select
                                                        className="border rounded p-1 text-sm bg-gray-50 mb-1"
                                                        value={node.data.icon || 'star'}
                                                        onChange={(e) => updateNodeData(targetId, { icon: e.target.value })}
                                                    >
                                                        <option value="link">Link</option>
                                                        <option value="calendar">Calendar</option>
                                                        <option value="rsvp">Mail (RSVP)</option>
                                                        <option value="speech">Speech</option>
                                                        <option value="heart">Heart</option>
                                                        <option value="star">Star</option>
                                                        <option value="map">Map Pin</option>
                                                        <option value="phone">Phone</option>
                                                        <option value="video">Video</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="border rounded p-1 text-xs"
                                                        placeholder="Custom Icon URL (Optional)"
                                                        value={node.data.customIcon || ''}
                                                        onChange={(e) => updateNodeData(targetId, { customIcon: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Config */}
                                        <div className="flex flex-col gap-2 border-t pt-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Action</label>
                                            <select
                                                className="border rounded p-2 text-sm w-full bg-blue-50/50"
                                                value={node.data.actionType || 'none'}
                                                onChange={(e) => updateNodeData(targetId, { actionType: e.target.value })}
                                            >
                                                <option value="none">None</option>
                                                <option value="link">Redirect to Link</option>
                                                <option value="map">Open Map</option>
                                                <option value="calendar">Save Date</option>
                                                <option value="rsvp">Open RSVP</option>
                                                <option value="speech">Write Speech (Wishes)</option>
                                            </select>

                                            {node.data.actionType === 'link' && (
                                                <div className="bg-gray-50 p-2 rounded space-y-2">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500">URL</label>
                                                        <input
                                                            type="text"
                                                            className="border rounded p-1 text-xs"
                                                            placeholder="https://google.com"
                                                            value={node.data.linkUrl || ''}
                                                            onChange={(e) => updateNodeData(targetId, { linkUrl: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500">Target</label>
                                                        <select
                                                            className="border rounded p-1 text-xs"
                                                            value={node.data.linkTarget || '_blank'}
                                                            onChange={(e) => updateNodeData(targetId, { linkTarget: e.target.value })}
                                                        >
                                                            <option value="_blank">New Tab</option>
                                                            <option value="_self">Same Tab</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {node.data.actionType === 'map' && (
                                                <div className="bg-gray-50 p-2 rounded space-y-2">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500">Address or Location</label>
                                                        <input
                                                            type="text"
                                                            className="border rounded p-1 text-xs"
                                                            placeholder="e.g., 123 Main St, City, Country"
                                                            value={node.data.mapAddress || ''}
                                                            onChange={(e) => updateNodeData(targetId, { mapAddress: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500">Map Provider</label>
                                                        <select
                                                            className="border rounded p-1 text-xs"
                                                            value={node.data.mapProvider || 'auto'}
                                                            onChange={(e) => updateNodeData(targetId, { mapProvider: e.target.value })}
                                                        >
                                                            <option value="auto">Auto (Waze on mobile, Google/Apple on desktop)</option>
                                                            <option value="waze">Waze</option>
                                                            <option value="google">Google Maps</option>
                                                            <option value="apple">Apple Maps</option>
                                                        </select>
                                                        <p className="text-[9px] text-gray-400 mt-1">
                                                            Auto: Waze on mobile, Google Maps (Android/Web) or Apple Maps (iOS/Mac) on desktop
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {node.data.actionType === 'calendar' && (
                                                <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-500 italic">
                                                    Uses event details from theme settings.
                                                </div>
                                            )}

                                            {node.data.actionType === 'speech' && (
                                                <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-500 italic">
                                                    Opens modal for guests to leave wishes.
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 border-t pt-2">
                                            <label className="text-[10px] text-gray-500 uppercase font-semibold">Alignment</label>
                                            <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
                                                {['left', 'center', 'right'].map((align) => (
                                                    <button
                                                        key={align}
                                                        className={`p-1 rounded ${node.style.textAlign === align ? 'bg-white shadow' : 'text-gray-400'}`}
                                                        onClick={() => updateNodeStyle(targetId, { textAlign: align })}
                                                        title={align}
                                                    >
                                                        {align === 'left' && <AlignLeft size={14} />}
                                                        {align === 'center' && <AlignCenter size={14} />}
                                                        {align === 'right' && <AlignRight size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 mt-2">
                                            <label className="text-xs text-gray-600">Font Family</label>
                                            <select
                                                className="border w-full p-1 text-sm"
                                                value={node.style.fontFamily || 'sans'}
                                                onChange={(e) => updateNodeStyle(targetId, { fontFamily: e.target.value })}
                                            >
                                                <option value="sans">Sans Serif</option>
                                                <option value="serif">Serif</option>
                                                <option value="mono">Monospace</option>
                                                <option value="cursive">Cursive</option>
                                                <option value="fantasy">Fantasy</option>
                                            </select>
                                        </div>

                                        {/* Modal Configuration - Visible if action is not none */}
                                        {node.data.actionType && node.data.actionType !== 'none' && node.data.actionType !== 'link' && (
                                            <div className="flex flex-col gap-2 border-t pt-2 border-orange-200 bg-orange-50/50 p-2 rounded">
                                                <label className="text-[10px] uppercase font-bold text-orange-600">Modal Container Style</label>

                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] text-gray-500">Background Color</label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-8 cursor-pointer rounded border"
                                                        value={node.data.modalBackgroundColor || '#ffffff'}
                                                        onChange={(e) => updateNodeData(targetId, { modalBackgroundColor: e.target.value })}
                                                    />
                                                </div>

                                                <BorderControl
                                                    label="Modal Border"
                                                    values={{
                                                        top: node.data.modalBorderTopWidth,
                                                        right: node.data.modalBorderRightWidth,
                                                        bottom: node.data.modalBorderBottomWidth,
                                                        left: node.data.modalBorderLeftWidth,
                                                        topColor: node.data.modalBorderTopColor,
                                                        rightColor: node.data.modalBorderRightColor,
                                                        bottomColor: node.data.modalBorderBottomColor,
                                                        leftColor: node.data.modalBorderLeftColor,
                                                    }}
                                                    onValuesChange={(newValues) => {
                                                        updateNodeData(targetId, {
                                                            modalBorderTopWidth: newValues.top,
                                                            modalBorderRightWidth: newValues.right,
                                                            modalBorderBottomWidth: newValues.bottom,
                                                            modalBorderLeftWidth: newValues.left,
                                                            modalBorderTopColor: newValues.topColor,
                                                            modalBorderRightColor: newValues.rightColor,
                                                            modalBorderBottomColor: newValues.bottomColor,
                                                            modalBorderLeftColor: newValues.leftColor,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Speech Specific Config */}
                                        {node.data.actionType === 'speech' && (
                                            <div className="flex flex-col gap-2 border-t pt-2 border-rose-200 bg-rose-50/50 p-2 rounded">
                                                <label className="text-[10px] uppercase font-bold text-rose-600">Speech Form Config</label>

                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] text-gray-500">Title Placeholder</label>
                                                    <input type="text" className="border rounded p-1 text-xs" value={node.data.speechPlaceholderName} onChange={(e) => updateNodeData(targetId, { speechPlaceholderName: e.target.value })} placeholder="Your Name" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] text-gray-500">Message Placeholder</label>
                                                    <input type="text" className="border rounded p-1 text-xs" value={node.data.speechPlaceholderMessage} onChange={(e) => updateNodeData(targetId, { speechPlaceholderMessage: e.target.value })} placeholder="Write your wishes..." />
                                                </div>

                                                <div className="flex flex-col gap-2 mt-2 border-t border-rose-200 pt-2">
                                                    <label className="text-[10px] font-semibold text-rose-600">Submit Button Style</label>

                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500">Button Text</label>
                                                        <input type="text" className="border rounded p-1 text-xs" value={node.data.speechSubmitText} onChange={(e) => updateNodeData(targetId, { speechSubmitText: e.target.value })} placeholder="Send Wishes" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-[10px] text-gray-500">Font</label>
                                                            <select
                                                                className="border w-full p-1 text-[10px]"
                                                                value={node.data.speechBtnFontFamily || 'sans'}
                                                                onChange={(e) => updateNodeData(targetId, { speechBtnFontFamily: e.target.value })}
                                                            >
                                                                <option value="sans">Sans</option>
                                                                <option value="serif">Serif</option>
                                                                <option value="mono">Mono</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-[10px] text-gray-500">Size</label>
                                                            <input type="text" className="border rounded p-1 text-xs" value={node.data.speechBtnFontSize || ''} onChange={(e) => updateNodeData(targetId, { speechBtnFontSize: e.target.value })} placeholder="14px" />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-[10px] text-gray-500">Text Color</label>
                                                            <input type="color" className="w-full h-6 border rounded" value={node.data.speechBtnColor || '#ffffff'} onChange={(e) => updateNodeData(targetId, { speechBtnColor: e.target.value })} />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-[10px] text-gray-500">Bg Color</label>
                                                            <input type="color" className="w-full h-6 border rounded" value={node.data.speechBtnBgColor || '#e11d48'} onChange={(e) => updateNodeData(targetId, { speechBtnBgColor: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    <BorderControl
                                                        label="Submit Button Border"
                                                        values={{
                                                            top: node.data.speechBtnBorderTopWidth,
                                                            right: node.data.speechBtnBorderRightWidth,
                                                            bottom: node.data.speechBtnBorderBottomWidth,
                                                            left: node.data.speechBtnBorderLeftWidth,
                                                            topColor: node.data.speechBtnBorderTopColor,
                                                            rightColor: node.data.speechBtnBorderRightColor,
                                                            bottomColor: node.data.speechBtnBorderBottomColor,
                                                            leftColor: node.data.speechBtnBorderLeftColor,
                                                        }}
                                                        onValuesChange={(newValues) => {
                                                            updateNodeData(targetId, {
                                                                speechBtnBorderTopWidth: newValues.top,
                                                                speechBtnBorderRightWidth: newValues.right,
                                                                speechBtnBorderBottomWidth: newValues.bottom,
                                                                speechBtnBorderLeftWidth: newValues.left,
                                                                speechBtnBorderTopColor: newValues.topColor,
                                                                speechBtnBorderRightColor: newValues.rightColor,
                                                                speechBtnBorderBottomColor: newValues.bottomColor,
                                                                speechBtnBorderLeftColor: newValues.leftColor,
                                                            });
                                                        }}

                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Door Settings */}
                                {node.type === 'door' && (
                                    <DoorSettings node={node} onUpdate={(data) => updateNodeData(targetId, data)} />
                                )}

                                {/* Countdown Widget Specifics */}
                                {node.type === 'countdown' && (
                                    <div className="flex flex-col gap-3">
                                        {/* Numbers Properties */}
                                        <div className="space-y-3 border rounded-lg p-3 bg-white shadow-sm">
                                            <h4 className="text-xs uppercase font-bold text-blue-600 flex items-center gap-2 border-b pb-2">
                                                <Type size={14} /> Countdown Numbers Properties
                                            </h4>
                                            
                                            {/* Font Color */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Font Color</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        className="h-8 w-8 cursor-pointer rounded border p-0"
                                                        value={node.data.numberColor || '#000000'}
                                                        onChange={(e) => updateNodeData(targetId, { numberColor: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="flex-1 text-xs border rounded px-2"
                                                        value={node.data.numberColor || '#000000'}
                                                        onChange={(e) => updateNodeData(targetId, { numberColor: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Font Weight */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Font Weight</label>
                                                <select
                                                    className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                    value={node.data.numberFontWeight || 'bold'}
                                                    onChange={(e) => updateNodeData(targetId, { numberFontWeight: e.target.value })}
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="bold">Bold</option>
                                                    <option value="100">100 (Thin)</option>
                                                    <option value="200">200 (Extra Light)</option>
                                                    <option value="300">300 (Light)</option>
                                                    <option value="400">400 (Regular)</option>
                                                    <option value="500">500 (Medium)</option>
                                                    <option value="600">600 (Semi Bold)</option>
                                                    <option value="700">700 (Bold)</option>
                                                    <option value="800">800 (Extra Bold)</option>
                                                    <option value="900">900 (Black)</option>
                                                </select>
                                            </div>

                                            {/* Font Family */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Font Family</label>
                                                <select
                                                    className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                    value={node.data.numberFontFamily || 'sans'}
                                                    onChange={(e) => updateNodeData(targetId, { numberFontFamily: e.target.value })}
                                                >
                                                    <option value="sans">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="mono">Monospace</option>
                                                    <option value="cursive">Cursive</option>
                                                    <option value="fantasy">Fantasy</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Text Labels Properties */}
                                        <div className="space-y-3 border rounded-lg p-3 bg-white shadow-sm">
                                            <h4 className="text-xs uppercase font-bold text-green-600 flex items-center gap-2 border-b pb-2">
                                                <Type size={14} /> Text Labels Properties
                                            </h4>

                                            {/* Show/Hide Labels Toggle */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] text-gray-500">Show Labels</label>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={node.data.showLabels !== false}
                                                    onChange={(e) => updateNodeData(targetId, { showLabels: e.target.checked })}
                                                />
                                            </div>

                                            {/* Font Color */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Font Color</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        className="h-8 w-8 cursor-pointer rounded border p-0"
                                                        value={node.data.labelColor || '#666666'}
                                                        onChange={(e) => updateNodeData(targetId, { labelColor: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="flex-1 text-xs border rounded px-2"
                                                        value={node.data.labelColor || '#666666'}
                                                        onChange={(e) => updateNodeData(targetId, { labelColor: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Font Family */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Font Family</label>
                                                <select
                                                    className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                    value={node.data.labelFontFamily || 'sans'}
                                                    onChange={(e) => updateNodeData(targetId, { labelFontFamily: e.target.value })}
                                                >
                                                    <option value="sans">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="mono">Monospace</option>
                                                    <option value="cursive">Cursive</option>
                                                    <option value="fantasy">Fantasy</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Layout Properties */}
                                        <div className="space-y-3 border rounded-lg p-3 bg-white shadow-sm">
                                            <h4 className="text-xs uppercase font-bold text-orange-600 flex items-center gap-2 border-b pb-2">
                                                <Layout size={14} /> Layout Properties
                                            </h4>

                                            {/* Gap Between Counters */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Gap Between Counters (px)</label>
                                                <input
                                                    type="number"
                                                    className="w-full text-xs border rounded px-2 py-1"
                                                    value={node.data.gap || 20}
                                                    onChange={(e) => updateNodeData(targetId, { gap: parseInt(e.target.value) || 20 })}
                                                    min="0"
                                                />
                                                <p className="text-[9px] text-gray-400 mt-1">Space between each counter item</p>
                                            </div>

                                            {/* Padding Controls */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Padding (px)</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Top</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.countdownPaddingTop ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { countdownPaddingTop: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Right</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.countdownPaddingRight ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { countdownPaddingRight: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Bottom</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.countdownPaddingBottom ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { countdownPaddingBottom: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Left</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.countdownPaddingLeft ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { countdownPaddingLeft: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Image Slider Widget Specifics */}
                                {node.type === 'slider' && (
                                    <div className="flex flex-col gap-3">
                                        <div className="space-y-3 border rounded-lg p-3 bg-white shadow-sm">
                                            <h4 className="text-xs uppercase font-bold text-purple-600 flex items-center gap-2 border-b pb-2">
                                                <Settings size={14} /> Image Slider Settings
                                            </h4>
                                            
                                            {/* Images List */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] text-gray-500">Images</label>
                                                    <button
                                                        onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = 'image/*';
                                                            input.multiple = true;
                                                            input.onchange = (e: any) => {
                                                                const files = e.target.files;
                                                                if (files) {
                                                                    const newImages: string[] = [];
                                                                    Array.from(files as FileList).forEach((file: File) => {
                                                                        const url = URL.createObjectURL(file);
                                                                        newImages.push(url);
                                                                    });
                                                                    updateNodeData(targetId, { images: [...(node.data.images || []), ...newImages] });
                                                                }
                                                            };
                                                            input.click();
                                                        }}
                                                        className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] hover:bg-blue-700 flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> Add Images
                                                    </button>
                                                </div>
                                                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                                                    {(node.data.images || []).map((img: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-2 p-2 border border-gray-300 rounded bg-white">
                                                            <img src={img} alt={`Slide ${idx + 1}`} className="w-12 h-12 object-cover rounded" />
                                                            <span className="flex-1 text-[10px] text-gray-600 truncate">Image {idx + 1}</span>
                                                            <button
                                                                onClick={() => {
                                                                    const newImages = (node.data.images || []).filter((_: string, i: number) => i !== idx);
                                                                    updateNodeData(targetId, { images: newImages });
                                                                }}
                                                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                                                title="Remove image"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {(!node.data.images || node.data.images.length === 0) && (
                                                        <p className="text-[10px] text-gray-400 text-center py-4">No images added yet</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Slides Per View */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Slides Per View</label>
                                                <input
                                                    type="number"
                                                    className="w-full text-xs border rounded px-2 py-1"
                                                    value={node.data.slidesPerView || 1}
                                                    onChange={(e) => updateNodeData(targetId, { slidesPerView: Math.max(1, parseInt(e.target.value) || 1) })}
                                                    min="1"
                                                />
                                                <p className="text-[9px] text-gray-400 mt-1">Number of images to show at once</p>
                                            </div>

                                            {/* Autoplay */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] text-gray-500">Autoplay</label>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={node.data.autoPlay ?? false}
                                                    onChange={(e) => updateNodeData(targetId, { autoPlay: e.target.checked })}
                                                />
                                            </div>

                                            {/* Container Width */}
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-gray-500">Container Width</label>
                                                <select
                                                    className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                    value={node.data.containerWidth || 'full'}
                                                    onChange={(e) => updateNodeData(targetId, { containerWidth: e.target.value })}
                                                >
                                                    <option value="full">Full Width</option>
                                                    <option value="custom">Custom Width</option>
                                                </select>
                                            </div>

                                            {/* Custom Width (only shown when custom is selected) */}
                                            {node.data.containerWidth === 'custom' && (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Custom Width (px)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full text-xs border rounded px-2 py-1"
                                                        value={node.data.customWidth || 300}
                                                        onChange={(e) => updateNodeData(targetId, { customWidth: Math.max(100, parseInt(e.target.value) || 300) })}
                                                        min="100"
                                                    />
                                                    <p className="text-[9px] text-gray-400 mt-1">Maximum: Container width</p>
                                                </div>
                                            )}

                                            {/* Enable Pagination */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] text-gray-500">Enable Pagination</label>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={node.data.enablePagination ?? true}
                                                    onChange={(e) => updateNodeData(targetId, { enablePagination: e.target.checked })}
                                                />
                                            </div>

                                            {/* Pagination Type (only shown when pagination is enabled) */}
                                            {node.data.enablePagination && (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Pagination Type</label>
                                                    <select
                                                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                        value={node.data.paginationType || 'dot'}
                                                        onChange={(e) => updateNodeData(targetId, { paginationType: e.target.value })}
                                                    >
                                                        <option value="dot">Dot</option>
                                                        <option value="number">Number</option>
                                                        <option value="none">None</option>
                                                    </select>
                                                </div>
                                            )}

                                            {/* Padding Controls */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Padding (px)</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Top</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.sliderPaddingTop ?? 0}
                                                            onChange={(e) => updateNodeData(targetId, { sliderPaddingTop: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Right</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.sliderPaddingRight ?? 0}
                                                            onChange={(e) => updateNodeData(targetId, { sliderPaddingRight: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Bottom</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.sliderPaddingBottom ?? 0}
                                                            onChange={(e) => updateNodeData(targetId, { sliderPaddingBottom: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Left</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.sliderPaddingLeft ?? 0}
                                                            onChange={(e) => updateNodeData(targetId, { sliderPaddingLeft: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Congratulation Speech Widget Specifics */}
                                {node.type === 'congratulation-speech' && (
                                    <div className="flex flex-col gap-3">
                                        <div className="space-y-3 border rounded-lg p-3 bg-white shadow-sm">
                                            <h4 className="text-xs uppercase font-bold text-indigo-600 flex items-center gap-2 border-b pb-2">
                                                <Type size={14} /> Congratulation Speech Settings
                                            </h4>

                                            {/* Auto Scroll Toggle */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] text-gray-500">Enable Auto Scroll Loop</label>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={node.data.enableAutoScroll ?? false}
                                                    onChange={(e) => updateNodeData(targetId, { enableAutoScroll: e.target.checked })}
                                                />
                                            </div>

                                            {/* Auto Scroll Delay (only shown when auto scroll is enabled) */}
                                            {node.data.enableAutoScroll && (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Auto Scroll Delay (ms)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full text-xs border rounded px-2 py-1"
                                                        value={node.data.autoScrollDelay || 3000}
                                                        onChange={(e) => updateNodeData(targetId, { autoScrollDelay: parseInt(e.target.value) || 3000 })}
                                                        min="1000"
                                                        step="500"
                                                    />
                                                    <p className="text-[9px] text-gray-400 mt-1">Time to display each speech before scrolling to next</p>
                                                </div>
                                            )}

                                            {/* Speech Text Properties */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Speech Text</h5>
                                                
                                                {/* Font Color */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            className="h-8 w-8 cursor-pointer rounded border p-0"
                                                            value={node.data.speechTextColor || '#333333'}
                                                            onChange={(e) => updateNodeData(targetId, { speechTextColor: e.target.value })}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="flex-1 text-xs border rounded px-2"
                                                            value={node.data.speechTextColor || '#333333'}
                                                            onChange={(e) => updateNodeData(targetId, { speechTextColor: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Font Size */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Size (px)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full text-xs border rounded px-2 py-1"
                                                        value={node.data.speechTextFontSize || 14}
                                                        onChange={(e) => updateNodeData(targetId, { speechTextFontSize: parseInt(e.target.value) || 14 })}
                                                        min="8"
                                                        max="72"
                                                    />
                                                </div>

                                                {/* Font Weight */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Weight</label>
                                                    <select
                                                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                        value={node.data.speechTextFontWeight || 'normal'}
                                                        onChange={(e) => updateNodeData(targetId, { speechTextFontWeight: e.target.value })}
                                                    >
                                                        <option value="normal">Normal</option>
                                                        <option value="bold">Bold</option>
                                                        <option value="100">100 (Thin)</option>
                                                        <option value="200">200 (Extra Light)</option>
                                                        <option value="300">300 (Light)</option>
                                                        <option value="400">400 (Regular)</option>
                                                        <option value="500">500 (Medium)</option>
                                                        <option value="600">600 (Semi Bold)</option>
                                                        <option value="700">700 (Bold)</option>
                                                        <option value="800">800 (Extra Bold)</option>
                                                        <option value="900">900 (Black)</option>
                                                    </select>
                                                </div>

                                                {/* Font Family */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Family</label>
                                                    <select
                                                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                        value={node.data.speechTextFontFamily || 'sans'}
                                                        onChange={(e) => updateNodeData(targetId, { speechTextFontFamily: e.target.value })}
                                                    >
                                                        <option value="sans">Sans Serif</option>
                                                        <option value="serif">Serif</option>
                                                        <option value="mono">Monospace</option>
                                                        <option value="cursive">Cursive</option>
                                                        <option value="fantasy">Fantasy</option>
                                                    </select>
                                                </div>

                                                {/* Text Align */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Text Align</label>
                                                    <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
                                                        {['left', 'center', 'right'].map((align) => (
                                                            <button
                                                                key={align}
                                                                className={`p-1 rounded ${node.data.speechTextAlign === align ? 'bg-white shadow' : 'text-gray-400'}`}
                                                                onClick={() => updateNodeData(targetId, { speechTextAlign: align })}
                                                                title={align}
                                                            >
                                                                {align === 'left' && <AlignLeft size={14} />}
                                                                {align === 'center' && <AlignCenter size={14} />}
                                                                {align === 'right' && <AlignRight size={14} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Author Text Properties */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Author Text</h5>
                                                
                                                {/* Font Color */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Color</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            className="h-8 w-8 cursor-pointer rounded border p-0"
                                                            value={node.data.authorTextColor || '#666666'}
                                                            onChange={(e) => updateNodeData(targetId, { authorTextColor: e.target.value })}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="flex-1 text-xs border rounded px-2"
                                                            value={node.data.authorTextColor || '#666666'}
                                                            onChange={(e) => updateNodeData(targetId, { authorTextColor: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Font Size */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Size (px)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full text-xs border rounded px-2 py-1"
                                                        value={node.data.authorTextFontSize || 12}
                                                        onChange={(e) => updateNodeData(targetId, { authorTextFontSize: parseInt(e.target.value) || 12 })}
                                                        min="8"
                                                        max="72"
                                                    />
                                                </div>

                                                {/* Font Weight */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Weight</label>
                                                    <select
                                                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                        value={node.data.authorTextFontWeight || 'normal'}
                                                        onChange={(e) => updateNodeData(targetId, { authorTextFontWeight: e.target.value })}
                                                    >
                                                        <option value="normal">Normal</option>
                                                        <option value="bold">Bold</option>
                                                        <option value="100">100 (Thin)</option>
                                                        <option value="200">200 (Extra Light)</option>
                                                        <option value="300">300 (Light)</option>
                                                        <option value="400">400 (Regular)</option>
                                                        <option value="500">500 (Medium)</option>
                                                        <option value="600">600 (Semi Bold)</option>
                                                        <option value="700">700 (Bold)</option>
                                                        <option value="800">800 (Extra Bold)</option>
                                                        <option value="900">900 (Black)</option>
                                                    </select>
                                                </div>

                                                {/* Font Family */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Font Family</label>
                                                    <select
                                                        className="w-full text-xs p-2 border rounded bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors"
                                                        value={node.data.authorTextFontFamily || 'sans'}
                                                        onChange={(e) => updateNodeData(targetId, { authorTextFontFamily: e.target.value })}
                                                    >
                                                        <option value="sans">Sans Serif</option>
                                                        <option value="serif">Serif</option>
                                                        <option value="mono">Monospace</option>
                                                        <option value="cursive">Cursive</option>
                                                        <option value="fantasy">Fantasy</option>
                                                    </select>
                                                </div>

                                                {/* Text Align */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-500">Text Align</label>
                                                    <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
                                                        {['left', 'center', 'right'].map((align) => (
                                                            <button
                                                                key={align}
                                                                className={`p-1 rounded ${node.data.authorTextAlign === align ? 'bg-white shadow' : 'text-gray-400'}`}
                                                                onClick={() => updateNodeData(targetId, { authorTextAlign: align })}
                                                                title={align}
                                                            >
                                                                {align === 'left' && <AlignLeft size={14} />}
                                                                {align === 'center' && <AlignCenter size={14} />}
                                                                {align === 'right' && <AlignRight size={14} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mockup Speeches */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Mockup Speeches</h5>
                                                    <button
                                                        onClick={() => {
                                                            const currentMockups = node.data.mockupSpeeches || [];
                                                            updateNodeData(targetId, {
                                                                mockupSpeeches: [
                                                                    ...currentMockups,
                                                                    { id: `mockup-${Date.now()}`, speech: '', author: '', timestamp: Date.now() }
                                                                ]
                                                            });
                                                        }}
                                                        className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] hover:bg-blue-700 flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> Add New
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                                                    {(node.data.mockupSpeeches || []).map((mockup: any, idx: number) => (
                                                        <div key={mockup.id || idx} className="flex flex-col gap-2 p-2 border border-gray-300 rounded bg-white">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[9px] text-gray-400 font-medium">Mockup {idx + 1}</span>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            const currentMockups = node.data.mockupSpeeches || [];
                                                                            const newMockups = [...currentMockups, {
                                                                                id: `mockup-${Date.now()}`,
                                                                                speech: mockup.speech || '',
                                                                                author: mockup.author || '',
                                                                                timestamp: Date.now()
                                                                            }];
                                                                            updateNodeData(targetId, { mockupSpeeches: newMockups });
                                                                        }}
                                                                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                                                                        title="Duplicate"
                                                                    >
                                                                        <Copy size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            const currentMockups = node.data.mockupSpeeches || [];
                                                                            const newMockups = currentMockups.filter((_: any, i: number) => i !== idx);
                                                                            updateNodeData(targetId, { mockupSpeeches: newMockups });
                                                                        }}
                                                                        className="p-1 rounded text-red-600 hover:bg-red-50"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] text-gray-400">Speech</label>
                                                                <textarea
                                                                    className="w-full text-xs border rounded px-2 py-1 resize-none"
                                                                    rows={2}
                                                                    value={mockup.speech || ''}
                                                                    onChange={(e) => {
                                                                        const currentMockups = node.data.mockupSpeeches || [];
                                                                        const newMockups = [...currentMockups];
                                                                        newMockups[idx] = { ...newMockups[idx], speech: e.target.value };
                                                                        updateNodeData(targetId, { mockupSpeeches: newMockups });
                                                                    }}
                                                                    placeholder="Enter speech text..."
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] text-gray-400">Author</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full text-xs border rounded px-2 py-1"
                                                                    value={mockup.author || ''}
                                                                    onChange={(e) => {
                                                                        const currentMockups = node.data.mockupSpeeches || [];
                                                                        const newMockups = [...currentMockups];
                                                                        newMockups[idx] = { ...newMockups[idx], author: e.target.value };
                                                                        updateNodeData(targetId, { mockupSpeeches: newMockups });
                                                                    }}
                                                                    placeholder="Enter author name..."
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!node.data.mockupSpeeches || node.data.mockupSpeeches.length === 0) && (
                                                        <p className="text-[10px] text-gray-400 text-center py-4">No mockup speeches added yet</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Padding Controls */}
                                            <div className="space-y-2 pt-2 border-t border-dashed">
                                                <h5 className="text-[10px] font-semibold text-gray-500 uppercase">Container Padding (px)</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Top</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.speechPaddingTop ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { speechPaddingTop: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Right</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.speechPaddingRight ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { speechPaddingRight: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Bottom</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.speechPaddingBottom ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { speechPaddingBottom: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] text-gray-400">Left</label>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs border rounded px-2 py-1"
                                                            value={node.data.speechPaddingLeft ?? 16}
                                                            onChange={(e) => updateNodeData(targetId, { speechPaddingLeft: parseInt(e.target.value) || 0 })}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Image Widget Specifics */}
                                {node.type === 'image' && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">Image Source</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="border rounded p-2 text-sm w-full"
                                                    value={node.data.url || ''}
                                                    onChange={(e) => updateNodeData(targetId, { url: e.target.value })}
                                                    placeholder="Image URL"
                                                />
                                                <div className="relative">
                                                    <button className="p-2 border rounded hover:bg-gray-50 text-gray-600" title="Upload Image">
                                                        <Upload size={16} />
                                                    </button>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const url = URL.createObjectURL(file);
                                                                updateNodeData(targetId, { url });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">Alt Text</label>
                                            <input
                                                type="text"
                                                className="border rounded p-2 text-sm w-full"
                                                value={node.data.alt || ''}
                                                onChange={(e) => updateNodeData(targetId, { alt: e.target.value })}
                                                placeholder="Description"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Modal Widget Specifics */}
                                {node.type === 'modal' && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Modal Type</label>
                                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                {node.data.modalType || 'calendar'}
                                            </div>
                                        </div>

                                        {/* Modal Container Style */}
                                        <div className="flex flex-col gap-2 border-t pt-2 border-orange-200 bg-orange-50/50 p-2 rounded">
                                            <label className="text-[10px] uppercase font-bold text-orange-600">Modal Container Style</label>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] text-gray-500">Background Color</label>
                                                <input
                                                    type="color"
                                                    className="w-full h-8 cursor-pointer rounded border"
                                                    value={node.data.modalBackgroundColor || '#ffffff'}
                                                    onChange={(e) => updateNodeData(targetId, { modalBackgroundColor: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] text-gray-500">Border Radius</label>
                                                <input
                                                    type="text"
                                                    className="border rounded p-1 text-xs"
                                                    value={node.data.modalBorderRadius || '16px'}
                                                    onChange={(e) => updateNodeData(targetId, { modalBorderRadius: e.target.value })}
                                                    placeholder="16px"
                                                />
                                            </div>

                                            <BorderControl
                                                label="Modal Border"
                                                values={{
                                                    top: node.data.modalBorderTopWidth,
                                                    right: node.data.modalBorderRightWidth,
                                                    bottom: node.data.modalBorderBottomWidth,
                                                    left: node.data.modalBorderLeftWidth,
                                                    topColor: node.data.modalBorderTopColor,
                                                    rightColor: node.data.modalBorderRightColor,
                                                    bottomColor: node.data.modalBorderBottomColor,
                                                    leftColor: node.data.modalBorderLeftColor,
                                                }}
                                                onValuesChange={(newValues) => {
                                                    updateNodeData(targetId, {
                                                        modalBorderTopWidth: newValues.top,
                                                        modalBorderRightWidth: newValues.right,
                                                        modalBorderBottomWidth: newValues.bottom,
                                                        modalBorderLeftWidth: newValues.left,
                                                        modalBorderTopColor: newValues.topColor,
                                                        modalBorderRightColor: newValues.rightColor,
                                                        modalBorderBottomColor: newValues.bottomColor,
                                                        modalBorderLeftColor: newValues.leftColor,
                                                    });
                                                }}
                                            />
                                        </div>

                                {/* Date & Time Format (for Calendar Modal) */}
                                {node.data.modalType === 'calendar' && (
                                    <div className="flex flex-col gap-2 border-t pt-2 border-blue-200 bg-blue-50/50 p-2 rounded">
                                        <label className="text-[10px] uppercase font-bold text-blue-600">Date & Time Format</label>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Date Format</label>
                                            <select
                                                className="border rounded p-1 text-xs"
                                                value={node.data.dateFormat || 'dd full month name years'}
                                                onChange={(e) => updateNodeData(targetId, { dateFormat: e.target.value })}
                                            >
                                                <option value="dd/mm/yy">dd/mm/yy</option>
                                                <option value="dd-mm-yy">dd-mm-yy</option>
                                                <option value="dd.mm.yy">dd.mm.yy</option>
                                                <option value="dd full month name years">dd full month name years</option>
                                                <option value="dd month short years">dd month short years</option>
                                                <option value="full date">Full Date</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Time Format</label>
                                            <select
                                                className="border rounded p-1 text-xs"
                                                value={node.data.timeFormat || 'start a.m/p.m - end a.m/p.m'}
                                                onChange={(e) => updateNodeData(targetId, { timeFormat: e.target.value })}
                                            >
                                                <option value="start a.m/p.m - end a.m/p.m">start a.m/p.m - end a.m/p.m</option>
                                                <option value="start hour:minute a.m/p.m - end hour:minute a.m/p.m">start hour:minute a.m/p.m - end hour:minute a.m/p.m</option>
                                                <option value="morning/evening">Morning/Evening</option>
                                                <option value="24-hour">24-Hour Format</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Text Element Styles */}
                                <div className="flex flex-col gap-2 border-t pt-2 border-purple-200 bg-purple-50/50 p-2 rounded">
                                    <label className="text-[10px] uppercase font-bold text-purple-600">Text Element Styles</label>

                                    {/* Title Style */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-gray-500">Title</label>
                                        <div className="grid grid-cols-2 gap-1">
                                            <input
                                                type="text"
                                                className="border rounded p-1 text-xs"
                                                placeholder="Font Size"
                                                value={node.data.modalStyles?.title?.fontSize || ''}
                                                onChange={(e) => {
                                                    const styles = { ...(node.data.modalStyles || {}) };
                                                    styles.title = { ...(styles.title || {}), fontSize: e.target.value };
                                                    updateNodeData(targetId, { modalStyles: styles });
                                                }}
                                            />
                                            <input
                                                type="color"
                                                className="w-full h-6 border rounded cursor-pointer"
                                                value={node.data.modalStyles?.title?.color || '#be123c'}
                                                onChange={(e) => {
                                                    const styles = { ...(node.data.modalStyles || {}) };
                                                    styles.title = { ...(styles.title || {}), color: e.target.value };
                                                    updateNodeData(targetId, { modalStyles: styles });
                                                }}
                                            />
                                        </div>
                                        <select
                                            className="border rounded p-1 text-xs"
                                            value={node.data.modalStyles?.title?.fontFamily || 'sans'}
                                            onChange={(e) => {
                                                const styles = { ...(node.data.modalStyles || {}) };
                                                styles.title = { ...(styles.title || {}), fontFamily: e.target.value };
                                                updateNodeData(targetId, { modalStyles: styles });
                                            }}
                                        >
                                            <option value="sans">Sans Serif</option>
                                            <option value="serif">Serif</option>
                                            <option value="mono">Monospace</option>
                                        </select>
                                    </div>

                                    {/* Date Style (Calendar Modal) */}
                                    {node.data.modalType === 'calendar' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Date Text</label>
                                    <div className="grid grid-cols-2 gap-1">
                                        <input
                                            type="text"
                                            className="border rounded p-1 text-xs"
                                            placeholder="Font Size"
                                            value={node.data.modalStyles?.date?.fontSize || ''}
                                            onChange={(e) => {
                                                const styles = { ...(node.data.modalStyles || {}) };
                                                styles.date = { ...(styles.date || {}), fontSize: e.target.value };
                                                updateNodeData(targetId, { modalStyles: styles });
                                            }}
                                        />
                                        <input
                                            type="color"
                                            className="w-full h-6 border rounded cursor-pointer"
                                            value={node.data.modalStyles?.date?.color || '#1f2937'}
                                            onChange={(e) => {
                                                const styles = { ...(node.data.modalStyles || {}) };
                                                styles.date = { ...(styles.date || {}), color: e.target.value };
                                                updateNodeData(targetId, { modalStyles: styles });
                                            }}
                                        />
                                    </div>
                                    <select
                                        className="border rounded p-1 text-xs"
                                        value={node.data.modalStyles?.date?.fontFamily || 'sans'}
                                        onChange={(e) => {
                                            const styles = { ...(node.data.modalStyles || {}) };
                                            styles.date = { ...(styles.date || {}), fontFamily: e.target.value };
                                            updateNodeData(targetId, { modalStyles: styles });
                                        }}
                                    >
                                        <option value="sans">Sans Serif</option>
                                        <option value="serif">Serif</option>
                                        <option value="mono">Monospace</option>
                                    </select>
                                </div>
                            )}

                                    {/* Time Style (Calendar Modal) */}
                                    {node.data.modalType === 'calendar' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Time Text</label>
                                            <div className="grid grid-cols-2 gap-1">
                                                <input
                                                    type="text"
                                                    className="border rounded p-1 text-xs"
                                                    placeholder="Font Size"
                                                    value={node.data.modalStyles?.time?.fontSize || ''}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.time = { ...(styles.time || {}), fontSize: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                                <input
                                                    type="color"
                                                    className="w-full h-6 border rounded cursor-pointer"
                                                    value={node.data.modalStyles?.time?.color || '#4b5563'}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.time = { ...(styles.time || {}), color: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                            </div>
                                            <select
                                                className="border rounded p-1 text-xs"
                                                value={node.data.modalStyles?.time?.fontFamily || 'sans'}
                                                onChange={(e) => {
                                                    const styles = { ...(node.data.modalStyles || {}) };
                                                    styles.time = { ...(styles.time || {}), fontFamily: e.target.value };
                                                    updateNodeData(targetId, { modalStyles: styles });
                                                }}
                                            >
                                                <option value="sans">Sans Serif</option>
                                                <option value="serif">Serif</option>
                                                <option value="mono">Monospace</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Location Style (Location Modal) */}
                                    {node.data.modalType === 'location' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Location Text</label>
                                            <div className="grid grid-cols-2 gap-1">
                                                <input
                                                    type="text"
                                                    className="border rounded p-1 text-xs"
                                                    placeholder="Font Size"
                                                    value={node.data.modalStyles?.location?.fontSize || ''}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.location = { ...(styles.location || {}), fontSize: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                                <input
                                                    type="color"
                                                    className="w-full h-6 border rounded cursor-pointer"
                                                    value={node.data.modalStyles?.location?.color || '#1f2937'}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.location = { ...(styles.location || {}), color: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                            </div>
                                            <select
                                                className="border rounded p-1 text-xs"
                                                value={node.data.modalStyles?.location?.fontFamily || 'sans'}
                                                onChange={(e) => {
                                                    const styles = { ...(node.data.modalStyles || {}) };
                                                    styles.location = { ...(styles.location || {}), fontFamily: e.target.value };
                                                    updateNodeData(targetId, { modalStyles: styles });
                                                }}
                                            >
                                                <option value="sans">Sans Serif</option>
                                                <option value="serif">Serif</option>
                                                <option value="mono">Monospace</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Contact Name Style (Contact Modal) */}
                                    {node.data.modalType === 'contact' && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-gray-500">Contact Name</label>
                                            <div className="grid grid-cols-2 gap-1">
                                                <input
                                                    type="text"
                                                    className="border rounded p-1 text-xs"
                                                    placeholder="Font Size"
                                                    value={node.data.modalStyles?.contactName?.fontSize || ''}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.contactName = { ...(styles.contactName || {}), fontSize: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                                <input
                                                    type="color"
                                                    className="w-full h-6 border rounded cursor-pointer"
                                                    value={node.data.modalStyles?.contactName?.color || '#be123c'}
                                                    onChange={(e) => {
                                                        const styles = { ...(node.data.modalStyles || {}) };
                                                        styles.contactName = { ...(styles.contactName || {}), color: e.target.value };
                                                        updateNodeData(targetId, { modalStyles: styles });
                                                    }}
                                                />
                                            </div>
                                            <select
                                                className="border rounded p-1 text-xs"
                                                value={node.data.modalStyles?.contactName?.fontFamily || 'sans'}
                                                onChange={(e) => {
                                                    const styles = { ...(node.data.modalStyles || {}) };
                                                    styles.contactName = { ...(styles.contactName || {}), fontFamily: e.target.value };
                                                    updateNodeData(targetId, { modalStyles: styles });
                                                }}
                                            >
                                                <option value="sans">Sans Serif</option>
                                                <option value="serif">Serif</option>
                                                <option value="mono">Monospace</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                                {/* === STYLE SETTINGS === */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Style</h3>

                                    {/* Background Image (Section/Container) */}
                                    {(node.type === 'section' || node.type === 'container') && (
                                        <>
                                            <div className="flex flex-col gap-1 mb-2">
                                                <label className="text-xs text-gray-600">Background</label>
                                                <select
                                                    className="border rounded p-2 text-sm w-full"
                                                    value={node.style.gradientType ? 'gradient' : 'color'}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'color') updateNodeStyle(targetId, { gradientType: undefined });
                                                        else updateNodeStyle(targetId, { gradientType: 'linear' });
                                                    }}
                                                >
                                                    <option value="color">Solid Color & Image</option>
                                                    <option value="gradient">Linear Gradient</option>
                                                </select>
                                            </div>

                                            {!node.style.gradientType ? (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="color"
                                                            className="w-8 h-8 rounded cursor-pointer border-none"
                                                            value={node.style.backgroundColor || '#ffffff'}
                                                            onChange={(e) => updateNodeStyle(targetId, { backgroundColor: e.target.value })}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="border rounded p-1 text-xs w-full"
                                                            value={node.style.backgroundColor || ''}
                                                            onChange={(e) => updateNodeStyle(targetId, { backgroundColor: e.target.value })}
                                                            placeholder="#ffffff"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            className="border rounded p-2 text-sm w-full pr-8 text-ellipsis"
                                                            value={node.style.backgroundImage || ''}
                                                            readOnly
                                                            placeholder="Image URL"
                                                        />
                                                        <div className="relative">
                                                            <button className="p-2 border rounded hover:bg-gray-50 text-gray-600">
                                                                <Upload size={14} />
                                                            </button>
                                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBackgroundUpload} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        className="border rounded p-2 text-sm w-full"
                                                        value={node.style.gradientDirection || 'to bottom'}
                                                        onChange={(e) => updateNodeStyle(targetId, { gradientDirection: e.target.value })}
                                                    >
                                                        <option value="to bottom">To Bottom</option>
                                                        <option value="to right">To Right</option>
                                                        <option value="to bottom right">Diagonal</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <input type="color" className="w-full h-8" value={node.style.gradientColor1 || '#ffffff'} onChange={(e) => updateNodeStyle(targetId, { gradientColor1: e.target.value })} />
                                                        <input type="color" className="w-full h-8" value={node.style.gradientColor2 || '#000000'} onChange={(e) => updateNodeStyle(targetId, { gradientColor2: e.target.value })} />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Section Height */}
                                    {node.type === 'section' && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            <label className="text-xs text-gray-600">Height</label>
                                            <select
                                                className="border rounded p-2 text-sm w-full mb-1"
                                                value={['auto', 'full'].includes(node.style.height) ? node.style.height : 'custom'}
                                                onChange={(e) => updateNodeStyle(targetId, { height: e.target.value === 'custom' ? '300px' : e.target.value })}
                                            >
                                                <option value="auto">Auto</option>
                                                <option value="full">Full Screen</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Padding & Margin */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">Padding</label>
                                            <input
                                                type="text"
                                                className="border rounded p-2 text-sm w-full"
                                                value={node.style.padding || ''}
                                                onChange={(e) => updateNodeStyle(targetId, { padding: e.target.value })}
                                                placeholder="20px"
                                            />
                                        </div>
                                    </div>

                                    {/* Backdrop Filter (Section/Container) */}
                                    {(node.type === 'section' || node.type === 'container') && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Backdrop Blur</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range" min="0" max="100"
                                                    className="flex-1"
                                                    value={node.style.backdropBlur ?? 0}
                                                    onChange={(e) => updateNodeStyle(targetId, { backdropBlur: parseInt(e.target.value) })}
                                                />
                                                <span className="text-xs w-12 text-right">{node.style.backdropBlur ?? 0}px</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* NEW: Display & Layout Controls (Section/Container) */}
                                    {(node.type === 'section' || node.type === 'container') && (
                                        <DisplayControl data={node.style} onChange={handleStyleChange} />
                                    )}

                                    {/* NEW: Border Controls (Section/Container/Button/Image) */}
                                    {(node.type === 'section' || node.type === 'container' || node.type === 'button' || node.type === 'image') && (
                                        <>
                                            <BorderControl label="Border" prefix="border" data={node.style} onChange={handleStyleChange} />
                                            <RadiusControl data={node.style} onChange={handleStyleChange} />
                                        </>
                                    )}

                                    {/* Motion Effects (Section/Container/Text/Button/Countdown/Slider/CongratulationSpeech) */}
                                    {(node.type === 'section' || node.type === 'container' || 
                                      node.type === 'text' || node.type === 'button' || 
                                      node.type === 'countdown' || node.type === 'slider' || 
                                      node.type === 'congratulation-speech') && (
                                        <div className="space-y-3 pt-4 border-t">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase">Motion Effects</h3>
                                            
                                            {/* Enable Animation Toggle */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs text-gray-600">Enable Animation</label>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={node.animation?.enabled || false}
                                                    onChange={(e) => updateNodeAnimation(targetId, { enabled: e.target.checked })}
                                                />
                                            </div>

                                            {node.animation?.enabled && (
                                                <>
                                                    {/* Trigger */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-600">Trigger</label>
                                                        <select
                                                            className="border rounded p-2 text-sm w-full"
                                                            value={node.animation?.trigger || 'none'}
                                                            onChange={(e) => updateNodeAnimation(targetId, { trigger: e.target.value as any })}
                                                        >
                                                            <option value="none">None</option>
                                                            <option value="scroll">On Scroll</option>
                                                            <option value="door">After Door Opens</option>
                                                            <option value="load">On Load</option>
                                                        </select>
                                                    </div>

                                                    {/* Preset */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-600">Animation Style</label>
                                                        <select
                                                            className="border rounded p-2 text-sm w-full"
                                                            value={node.animation?.preset || 'fadeUp'}
                                                            onChange={(e) => updateNodeAnimation(targetId, { preset: e.target.value as any })}
                                                        >
                                                            <option value="fadeUp">Fade Up</option>
                                                            <option value="fade">Fade</option>
                                                            <option value="slideLeft">Slide Left</option>
                                                            <option value="slideRight">Slide Right</option>
                                                        </select>
                                                    </div>

                                                    {/* Replay Toggle */}
                                                    {node.animation?.trigger === 'scroll' && (
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs text-gray-600">Replay on Scroll</label>
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                checked={node.animation?.replay || false}
                                                                onChange={(e) => updateNodeAnimation(targetId, { replay: e.target.checked })}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Advanced Options (Collapsible) */}
                                                    <details className="group">
                                                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 list-none">
                                                            <span className="flex items-center gap-1">
                                                                Advanced Options
                                                                <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                                                            </span>
                                                        </summary>
                                                        <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-200">
                                                            {/* Duration */}
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-gray-600">Duration (seconds)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0.1"
                                                                    max="3"
                                                                    step="0.1"
                                                                    className="border rounded p-1 text-xs w-full"
                                                                    value={node.animation?.duration || 0.6}
                                                                    onChange={(e) => updateNodeAnimation(targetId, { duration: parseFloat(e.target.value) || 0.6 })}
                                                                />
                                                            </div>

                                                            {/* Delay */}
                                                            <div className="space-y-1">
                                                                <label className="text-xs text-gray-600">Delay (seconds)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="2"
                                                                    step="0.1"
                                                                    className="border rounded p-1 text-xs w-full"
                                                                    value={node.animation?.delay || 0}
                                                                    onChange={(e) => updateNodeAnimation(targetId, { delay: parseFloat(e.target.value) || 0 })}
                                                                />
                                                            </div>

                                                            {/* Threshold (only for scroll) */}
                                                            {node.animation?.trigger === 'scroll' && (
                                                                <div className="space-y-1">
                                                                    <label className="text-xs text-gray-600">Visibility Threshold (0-1)</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="1"
                                                                        step="0.1"
                                                                        className="border rounded p-1 text-xs w-full"
                                                                        value={node.animation?.threshold || 0.1}
                                                                        onChange={(e) => updateNodeAnimation(targetId, { threshold: parseFloat(e.target.value) || 0.1 })}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </details>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export function PropertyPanelToggle({ isOpen, onToggle }: { isOpen: boolean, onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "absolute -left-6 top-4 z-50 bg-white border shadow-md p-1 rounded-l-md hover:bg-gray-50 text-gray-400",
                !isOpen && "-left-6"
            )}
        >
            {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
    );
}
