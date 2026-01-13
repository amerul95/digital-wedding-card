"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input } from "@/components/card/UI";
import { RichTextEditorWithMargins } from "@/components/forms/RichTextEditorWithMargins";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURATED_GOOGLE_FONTS } from "@/lib/fonts";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Page16Form() {
  const { event, updateEvent } = useEvent();
  const { customFonts } = useDesignerFonts();
  
  // Default mockup messages
  const defaultMockupMessages = [
    { id: "1", speech: "Tahniah! Semoga berbahagia selalu.", author: "Ahmad bin Hassan" },
    { id: "2", speech: "Selamat atas majlis yang berlangsung dengan jayanya. Semoga keluarga sentiasa diberkati dan dikurniakan kebahagiaan yang berpanjangan. Doa kami sentiasa bersama anda.", author: "Siti Nurhaliza binti Abdul Rahman" },
    { id: "3", speech: "Dengan penuh rasa syukur dan kegembiraan, kami ingin mengucapkan tahniah yang tidak terhingga atas majlis yang sungguh bermakna ini. Semoga ikatan kasih sayang yang terjalin pada hari ini akan terus berkembang dan menjadi lebih kukuh dari masa ke semasa. Semoga kehidupan berkeluarga yang baru ini dipenuhi dengan kebahagiaan, kesabaran, dan saling memahami. Doa kami sentiasa mengiringi perjalanan hidup anda berdua. Semoga Allah SWT memberkati setiap langkah yang diambil dan memberikan rezeki yang melimpah ruah. Amin.", author: "Dato' Seri Dr. Mohd Zulkifli bin Abdullah" },
  ];
  
  // Local state for color pickers to prevent excessive updates
  const [speechColor, setSpeechColor] = useState(event.congratsSpeechFontColor || "#1f2937");
  const [authorColor, setAuthorColor] = useState(event.congratsAuthorFontColor || "#6b7280");
  
  // Refs for color preview divs to update directly without re-renders
  const speechColorPreviewRef = useRef<HTMLDivElement>(null);
  const authorColorPreviewRef = useRef<HTMLDivElement>(null);
  const speechColorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authorColorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Sync local state with event when event changes externally
  useEffect(() => {
    const newColor = event.congratsSpeechFontColor || "#1f2937";
    setSpeechColor(newColor);
    if (speechColorPreviewRef.current) {
      speechColorPreviewRef.current.style.backgroundColor = newColor;
    }
  }, [event.congratsSpeechFontColor]);
  
  useEffect(() => {
    const newColor = event.congratsAuthorFontColor || "#6b7280";
    setAuthorColor(newColor);
    if (authorColorPreviewRef.current) {
      authorColorPreviewRef.current.style.backgroundColor = newColor;
    }
  }, [event.congratsAuthorFontColor]);

  // Check if messages need initialization
  // Messages exist if array has items AND at least one has non-empty speech
  const hasValidMessages = event.congratsMessages && 
    event.congratsMessages.length > 0 && 
    event.congratsMessages.some(msg => msg.speech && msg.speech.trim().length > 0);
  
  const initializationAttemptedRef = useRef(false);
  
  // Initialize messages immediately if they don't exist or are all empty
  // Run on mount first
  useEffect(() => {
    // If messages array is empty, undefined, or all messages have empty speech, initialize with mockup messages
    const shouldInitialize = !event.congratsMessages || 
      event.congratsMessages.length === 0 || 
      !event.congratsMessages.some(msg => msg.speech && msg.speech.trim().length > 0);
    
    if (shouldInitialize && !initializationAttemptedRef.current) {
      initializationAttemptedRef.current = true;
      // Initialize immediately with mockup messages so they appear in inputs
      // Use spread to create new array to avoid reference issues
      const messagesToSet = defaultMockupMessages.map(msg => ({ ...msg }));
      updateEvent({ congratsMessages: messagesToSet });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount
  
  // Also check when congratsMessages changes (e.g., after loading from API)
  // But only if we haven't already attempted initialization
  useEffect(() => {
    if (initializationAttemptedRef.current) return; // Already initialized
    
    const shouldInitialize = !event.congratsMessages || 
      event.congratsMessages.length === 0 || 
      !event.congratsMessages.some(msg => msg.speech && msg.speech.trim().length > 0);
    
    if (shouldInitialize) {
      initializationAttemptedRef.current = true;
      const messagesToSet = defaultMockupMessages.map(msg => ({ ...msg }));
      updateEvent({ congratsMessages: messagesToSet });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.congratsMessages]); // Run when congratsMessages changes

  // Function to load mockup messages (can be called manually)
  const loadMockupMessages = () => {
    const messagesToSet = defaultMockupMessages.map(msg => ({ ...msg }));
    updateEvent({ congratsMessages: messagesToSet });
  };

  // Always use messages from event state, but show defaultMockupMessages as fallback for display
  // This ensures the form shows the mockup messages immediately while they're being saved
  // If event has empty array or undefined, use defaultMockupMessages so inputs are pre-filled
  const messages = hasValidMessages 
    ? event.congratsMessages! 
    : defaultMockupMessages;

  const addMessage = () => {
    const currentMessages = event.congratsMessages && event.congratsMessages.length > 0 
      ? event.congratsMessages 
      : defaultMockupMessages;
    const newMessage = {
      id: Date.now().toString(),
      speech: "",
      author: "",
    };
    updateEvent({ congratsMessages: [...currentMessages, newMessage] });
  };

  const removeMessage = (id: string) => {
    const currentMessages = event.congratsMessages && event.congratsMessages.length > 0 
      ? event.congratsMessages 
      : defaultMockupMessages;
    updateEvent({ congratsMessages: currentMessages.filter((m) => m.id !== id) });
  };

  const updateMessage = (id: string, field: "speech" | "author", value: string) => {
    const currentMessages = event.congratsMessages && event.congratsMessages.length > 0 
      ? event.congratsMessages 
      : defaultMockupMessages;
    updateEvent({
      congratsMessages: currentMessages.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  return (
    <div className="bg-white p-6">
      <div className="space-y-0">
        {/* Title Text - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Ucapan Tahniah Title</Label>
          <div className="space-y-3">
            <RichTextEditorWithMargins
              content={event.congratsTitleText || ""}
              onChange={(html) => updateEvent({ congratsTitleText: html })}
              placeholder="Enter title text (e.g., Ucapan Tahniah)..."
              marginTop={event.congratsTitleMarginTop}
              marginRight={event.congratsTitleMarginRight}
              marginBottom={event.congratsTitleMarginBottom}
              marginLeft={event.congratsTitleMarginLeft}
              onMarginTopChange={(value) => updateEvent({ congratsTitleMarginTop: value })}
              onMarginRightChange={(value) => updateEvent({ congratsTitleMarginRight: value })}
              onMarginBottomChange={(value) => updateEvent({ congratsTitleMarginBottom: value })}
              onMarginLeftChange={(value) => updateEvent({ congratsTitleMarginLeft: value })}
            />
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Border Top (px)</Label>
                <Input
                  type="number"
                  value={event.congratsTitleBorderTop ?? 0}
                  onChange={(e) => updateEvent({ congratsTitleBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.congratsTitleBorderRight ?? 0}
                  onChange={(e) => updateEvent({ congratsTitleBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.congratsTitleBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ congratsTitleBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.congratsTitleBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ congratsTitleBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Label>Show Messages (Designer Preview Only)</Label>
              <Switch
                checked={event.showCongratsMessages !== false}
                onCheckedChange={(checked) => updateEvent({ showCongratsMessages: checked })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={loadMockupMessages}
                size="sm"
                variant="outline"
                className="h-8"
              >
                Load Mockup Messages
              </Button>
              <Button
                type="button"
                onClick={addMessage}
                size="sm"
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Message
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Note: This toggle is for designer preview only. Messages will always show for clients.
          </p>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-4 border border-gray-300 rounded bg-yellow-50 text-center">
                <p className="text-sm text-gray-600 mb-2">No messages found. Click "Load Mockup Messages" to add sample messages.</p>
                <Button
                  type="button"
                  onClick={loadMockupMessages}
                  size="sm"
                  variant="outline"
                >
                  Load Mockup Messages
                </Button>
              </div>
            ) : (
              messages.map((message, index) => (
              <div key={message.id} className="p-3 border border-gray-300 rounded bg-white">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm">Message {index + 1}</Label>
                  <Button
                    type="button"
                    onClick={() => removeMessage(message.id)}
                    size="sm"
                    variant="destructive"
                    className="h-7"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Speech (with quotes)</Label>
                    <Input
                      type="text"
                      value={message.speech}
                      onChange={(e) => updateMessage(message.id, "speech", e.target.value)}
                      placeholder="Enter congratulation speech..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Author (who gave the speech)</Label>
                    <Input
                      type="text"
                      value={message.author}
                      onChange={(e) => updateMessage(message.id, "author", e.target.value)}
                      placeholder="Enter author name..."
                    />
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Speech Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Speech Text Styling</Label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSpeechFontSize ?? 14}
                  onChange={(e) => updateEvent({ congratsSpeechFontSize: Number(e.target.value) || 14 })}
                  min="8"
                  max="72"
                  step="1"
                />
              </div>
              <div>
                <Label>Font Weight</Label>
                <Select
                  value={event.congratsSpeechFontWeight || "normal"}
                  onValueChange={(value) => updateEvent({ congratsSpeechFontWeight: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Regular (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Font Color</Label>
              <div className="flex gap-2 items-center">
                <div className="relative h-8 w-8">
                  <div
                    ref={speechColorPreviewRef}
                    className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: speechColor }}
                  />
                  <input
                    type="color"
                    value={speechColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      // Update preview directly without re-render
                      if (speechColorPreviewRef.current) {
                        speechColorPreviewRef.current.style.backgroundColor = newColor;
                      }
                      setSpeechColor(newColor);
                      // Debounce the context update
                      if (speechColorTimeoutRef.current) {
                        clearTimeout(speechColorTimeoutRef.current);
                      }
                      speechColorTimeoutRef.current = setTimeout(() => {
                        updateEvent({ congratsSpeechFontColor: newColor });
                      }, 100);
                    }}
                    onMouseUp={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (speechColorTimeoutRef.current) {
                        clearTimeout(speechColorTimeoutRef.current);
                      }
                      updateEvent({ congratsSpeechFontColor: value });
                    }}
                    onBlur={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (speechColorTimeoutRef.current) {
                        clearTimeout(speechColorTimeoutRef.current);
                      }
                      updateEvent({ congratsSpeechFontColor: value });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={speechColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSpeechColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ congratsSpeechFontColor: color });
                    }
                  }}
                  onBlur={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ congratsSpeechFontColor: color });
                    } else {
                      setSpeechColor(event.congratsSpeechFontColor || "#1f2937");
                    }
                  }}
                  placeholder="#1f2937"
                  className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <Select
                value={event.congratsSpeechFontFamily || "__default__"}
                onValueChange={(value) => updateEvent({ congratsSpeechFontFamily: value === "__default__" ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="__default__" className="text-xs">
                    Default
                  </SelectItem>
                  {CURATED_GOOGLE_FONTS.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      className="text-xs"
                      style={{ fontFamily: fontName }}
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                  {customFonts.map((font) => (
                    <SelectItem
                      key={font.fontFamily}
                      value={font.fontFamily}
                      className="text-xs"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.fontFamily}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Author Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Author Text Styling</Label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={event.congratsAuthorFontSize ?? 12}
                  onChange={(e) => updateEvent({ congratsAuthorFontSize: Number(e.target.value) || 12 })}
                  min="8"
                  max="72"
                  step="1"
                />
              </div>
              <div>
                <Label>Font Weight</Label>
                <Select
                  value={event.congratsAuthorFontWeight || "normal"}
                  onValueChange={(value) => updateEvent({ congratsAuthorFontWeight: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Regular (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Font Color</Label>
              <div className="flex gap-2 items-center">
                <div className="relative h-8 w-8">
                  <div
                    ref={authorColorPreviewRef}
                    className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: authorColor }}
                  />
                  <input
                    type="color"
                    value={authorColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      // Update preview directly without re-render
                      if (authorColorPreviewRef.current) {
                        authorColorPreviewRef.current.style.backgroundColor = newColor;
                      }
                      setAuthorColor(newColor);
                      // Debounce the context update
                      if (authorColorTimeoutRef.current) {
                        clearTimeout(authorColorTimeoutRef.current);
                      }
                      authorColorTimeoutRef.current = setTimeout(() => {
                        updateEvent({ congratsAuthorFontColor: newColor });
                      }, 100);
                    }}
                    onMouseUp={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (authorColorTimeoutRef.current) {
                        clearTimeout(authorColorTimeoutRef.current);
                      }
                      updateEvent({ congratsAuthorFontColor: value });
                    }}
                    onBlur={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (authorColorTimeoutRef.current) {
                        clearTimeout(authorColorTimeoutRef.current);
                      }
                      updateEvent({ congratsAuthorFontColor: value });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={authorColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setAuthorColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ congratsAuthorFontColor: color });
                    }
                  }}
                  onBlur={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      updateEvent({ congratsAuthorFontColor: color });
                    } else {
                      setAuthorColor(event.congratsAuthorFontColor || "#6b7280");
                    }
                  }}
                  placeholder="#6b7280"
                  className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <Select
                value={event.congratsAuthorFontFamily || "__default__"}
                onValueChange={(value) => updateEvent({ congratsAuthorFontFamily: value === "__default__" ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="__default__" className="text-xs">
                    Default
                  </SelectItem>
                  {CURATED_GOOGLE_FONTS.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      className="text-xs"
                      style={{ fontFamily: fontName }}
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                  {customFonts.map((font) => (
                    <SelectItem
                      key={font.fontFamily}
                      value={font.fontFamily}
                      className="text-xs"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.fontFamily}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Gap Control */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
          <Label>Gap Between Speech and Author (px)</Label>
          <Input
            type="number"
            value={event.congratsSpeechGap ?? 8}
            onChange={(e) => updateEvent({ congratsSpeechGap: Number(e.target.value) || 8 })}
            min="0"
            max="100"
            step="1"
          />
        </div>

        {/* Section Container Styling - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-0">
          <Label>Congratulations Section Container Styling</Label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Margin Top (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionMarginTop ?? ''}
                  onChange={(e) => updateEvent({ congratsSectionMarginTop: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionMarginBottom ?? ''}
                  onChange={(e) => updateEvent({ congratsSectionMarginBottom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Left (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionMarginLeft ?? ''}
                  onChange={(e) => updateEvent({ congratsSectionMarginLeft: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Margin Right (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionMarginRight ?? ''}
                  onChange={(e) => updateEvent({ congratsSectionMarginRight: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Border Top (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionBorderTop ?? 0}
                  onChange={(e) => updateEvent({ congratsSectionBorderTop: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Right (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionBorderRight ?? 0}
                  onChange={(e) => updateEvent({ congratsSectionBorderRight: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Bottom (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionBorderBottom ?? 0}
                  onChange={(e) => updateEvent({ congratsSectionBorderBottom: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <Label>Border Left (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionBorderLeft ?? 0}
                  onChange={(e) => updateEvent({ congratsSectionBorderLeft: Number(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <Label>Container Width (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionWidth ?? ''}
                  onChange={(e) => updateEvent({ congratsSectionWidth: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto (full width)"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for full width</p>
              </div>
              <div>
                <Label>Container Height (px)</Label>
                <Input
                  type="number"
                  value={event.congratsSectionHeight ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      updateEvent({ congratsSectionHeight: undefined });
                    } else {
                      const numValue = Number(value);
                      // Enforce minimum 150px
                      updateEvent({ congratsSectionHeight: Math.max(numValue, 150) });
                    }
                  }}
                  placeholder="Auto (no scroll)"
                  min="150"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 150px. Auto-scrolls if content exceeds height</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Scroll (Loop)</Label>
                  <p className="text-xs text-gray-500 mt-1">Enable continuous auto-scrolling</p>
                </div>
                <Switch
                  checked={event.congratsSectionAutoScroll || false}
                  onCheckedChange={(checked) => updateEvent({ congratsSectionAutoScroll: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
