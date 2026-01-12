"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link as LinkIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  Image as ImageIcon,
  Smile,
  Heading1,
  Heading2,
  Heading3,
  Type,
  MoreHorizontal,
  ChevronDown,
  Palette,
} from "lucide-react";
import { useDesignerFonts } from "@/context/DesignerFontContext";
import { CURATED_GOOGLE_FONTS, loadAllCuratedFonts } from "@/lib/fonts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  fontColor?: string;
  onFontColorChange?: (color: string) => void;
}

// FontSize Extension for individual text font size control
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', '') || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string | number) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: fontSize.toString() })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

// FontFamily Extension for text font family control
const FontFamily = Extension.create({
  name: 'fontFamily',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => {
              const fontFamily = element.style.fontFamily;
              if (!fontFamily) return null;
              // Remove quotes if present
              return fontFamily.replace(/['"]/g, '') || null;
            },
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontFamily: (fontFamily: string | null) => ({ chain }) => {
        if (!fontFamily) {
          return chain()
            .setMark('textStyle', { fontFamily: null })
            .removeEmptyTextStyle()
            .run()
        }
        return chain()
          .setMark('textStyle', { fontFamily })
          .run()
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

// LineHeight Extension for paragraph line height control
// Line-height must be applied to block elements (paragraphs), not inline text marks
const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => {
              // Get line-height from the element's style
              const lineHeight = element.style.lineHeight;
              return lineHeight || null;
            },
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string | number) => ({ commands, state }) => {
        const { $from } = state.selection;
        const node = $from.parent;
        const nodeType = node.type.name;
        
        if (nodeType === 'paragraph') {
          return commands.updateAttributes('paragraph', {
            lineHeight: lineHeight.toString(),
          });
        } else if (nodeType.startsWith('heading')) {
          return commands.updateAttributes('heading', {
            lineHeight: lineHeight.toString(),
          });
        }
        return false;
      },
      unsetLineHeight: () => ({ commands, state }) => {
        const { $from } = state.selection;
        const node = $from.parent;
        const nodeType = node.type.name;
        
        if (nodeType === 'paragraph') {
          return commands.updateAttributes('paragraph', {
            lineHeight: null,
          });
        } else if (nodeType.startsWith('heading')) {
          return commands.updateAttributes('heading', {
            lineHeight: null,
          });
        }
        return false;
      },
    }
  },
})

// Helper function to apply gradient via inline styles
const applyGradientToSelection = (editor: any, gradient: string) => {
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to);
  
  if (selectedText) {
    // Has selection, wrap it with gradient
    editor.chain()
      .focus()
      .deleteSelection()
      .insertContent(`<span style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;">${selectedText}</span>`)
      .run();
  } else {
    // No selection, insert gradient text at cursor
    editor.chain()
      .focus()
      .insertContent(`<span style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;">Text</span>`)
      .run();
  }
};

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder,
  fontSize,
  onFontSizeChange,
  fontColor,
  onFontColorChange,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [gradientColor1, setGradientColor1] = useState("#ff0000");
  const [gradientColor2, setGradientColor2] = useState("#0000ff");
  const [gradientDirection, setGradientDirection] = useState("to bottom");
  const [currentFontSize, setCurrentFontSize] = useState(fontSize || 16);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { customFonts } = useDesignerFonts();

  // Load Google Fonts on mount
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      loadAllCuratedFonts();
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (fontColor && !fontColor.startsWith('linear-gradient')) {
      setTextColor(fontColor);
    }
  }, [fontColor]);

  useEffect(() => {
    if (fontSize) {
      setCurrentFontSize(fontSize);
    }
  }, [fontSize]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#36463A] underline cursor-pointer",
        },
      }),
      TextStyle,
      FontSize,
      FontFamily,
      LineHeight,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 rounded p-2 font-mono text-sm",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-3",
        style: `font-size: ${currentFontSize}px;`,
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Prevent form submission and navigation on all keydown events
          // This prevents any unwanted navigation when typing
          if (event.key === 'Enter' && !event.shiftKey) {
            // Allow Enter to work normally in the editor, but prevent form submission
            const target = event.target as HTMLElement;
            if (target.closest('form')) {
              event.preventDefault();
              return true;
            }
          }
          // Stop propagation for all keyboard events to prevent navigation
          event.stopPropagation();
          return false;
        },
        beforeinput: (view, event) => {
          // Prevent any form-related behavior
          event.stopPropagation();
          return false;
        },
      },
    },
  }, [mounted, currentFontSize]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editor DOM style when fontSize changes (using ref instead of editor.view)
  useEffect(() => {
    if (!mounted || !editorContainerRef.current) return;
    
    // Update style using CSS on the editor container
    const editorContent = editorContainerRef.current.querySelector('.ProseMirror') as HTMLElement;
    if (editorContent) {
      editorContent.style.fontSize = `${currentFontSize}px`;
    }
  }, [currentFontSize, mounted]);

  // Sync text color with editor's current color
  useEffect(() => {
    if (editor) {
      const currentColor = editor.getAttributes("textStyle").color;
      const currentGradient = editor.getAttributes("textStyle").gradient;
      if (currentGradient) {
        // If gradient is set, don't update text color
        return;
      }
      if (currentColor) {
        setTextColor(currentColor);
      }
    }
  }, [editor]);

  const setLink = () => {
    if (linkUrl === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addEmoji = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  };

  const applyGradient = () => {
    if (!editor) return;
    const gradientValue = `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
    applyGradientToSelection(editor, gradientValue);
    onFontColorChange?.(gradientValue);
    setShowGradientPicker(false);
  };

  const applySolidColor = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setTextColor(color);
    onFontColorChange?.(color);
  };

  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    onFontSizeChange?.(size);
    // Update editor content style dynamically using ref
    if (editorContainerRef.current) {
      const editorContent = editorContainerRef.current.querySelector('.ProseMirror') as HTMLElement;
      if (editorContent) {
        editorContent.style.fontSize = `${size}px`;
      }
    }
  };

  if (!mounted || !editor) {
    return (
      <div className="border border-green-200 rounded-xl overflow-hidden min-h-[150px] p-3 bg-white">
        <div className="text-sm text-green-600">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Font Size Control */}
      {(fontSize !== undefined || onFontSizeChange) && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Font Size</label>
          <input
            type="number"
            value={currentFontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-green-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#36463A]"
            min="8"
            max="72"
          />
          <span className="text-xs text-gray-500">px</span>
        </div>
      )}

      {/* Editor Container */}
      <div 
        className="border border-green-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-300 relative"
        onKeyDown={(e) => {
          // Prevent all keyboard events from bubbling up
          e.stopPropagation();
        }}
        onKeyPress={(e) => {
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          // Prevent clicks from bubbling
          e.stopPropagation();
        }}
      >
        {/* Toolbar */}
        <div className="border-b border-green-200 bg-green-50 p-2 flex gap-1 flex-wrap items-center">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("bold")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("italic")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("underline")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("strike")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-green-300 mx-1" />

        {/* Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("code")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        {/* Text Color */}
        <DropdownMenu open={showColorPicker} onOpenChange={setShowColorPicker}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`p-2 rounded text-sm transition-colors ${
                editor.isActive("textStyle")
                  ? "bg-[#36463A] text-white"
                  : "bg-white text-[#36463A] hover:bg-green-100"
              }`}
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-3">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Text Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-8 w-8">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: textColor }}
                    />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => applySolidColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      setTextColor(color);
                      if (/^#[0-9A-F]{6}$/i.test(color)) {
                        applySolidColor(color);
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["#000000", "#36463A", "#ffffff", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applySolidColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Gradient Color Button */}
        {(fontColor !== undefined || onFontColorChange) && (
          <button
            type="button"
            onClick={() => {
              // Check if current selection has gradient by checking HTML
              const html = editor.getHTML();
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = html;
              const spanWithGradient = tempDiv.querySelector('span[style*="linear-gradient"]');
              if (spanWithGradient) {
                const style = spanWithGradient.getAttribute('style') || '';
                const match = style.match(/background:\s*linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
                if (match) {
                  setGradientDirection(match[1].trim());
                  setGradientColor1(match[2].trim());
                  setGradientColor2(match[3].trim());
                }
              }
              setShowGradientPicker(true);
            }}
            className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100"
            title="Gradient Color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </button>
        )}

        {/* Highlight */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`p-2 rounded text-sm transition-colors ${
                editor.isActive("highlight")
                  ? "bg-[#36463A] text-white"
                  : "bg-white text-[#36463A] hover:bg-green-100"
              }`}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-3">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Highlight Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative h-8 w-8">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: editor.getAttributes("highlight").color || "#FFFF00" }}
                    />
                    <input
                      type="color"
                      value={editor.getAttributes("highlight").color || "#FFFF00"}
                      onChange={(e) => {
                        editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={editor.getAttributes("highlight").color || "#FFFF00"}
                    onChange={(e) => {
                      editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                    }}
                    placeholder="#FFFF00"
                    className="flex-1 px-2 py-1 border border-green-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["#FFFF00", "#FFE066", "#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run();
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100 flex items-center gap-1"
              title="Font Size"
            >
              <span className="text-xs font-bold">Aa</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Font Size (px)</label>
                <input
                  type="number"
                  value={editor.getAttributes('textStyle').fontSize || ''}
                  onChange={(e) => {
                    const size = e.target.value;
                    if (size) {
                      editor.chain().focus().setFontSize(size).run();
                    } else {
                      editor.chain().focus().unsetFontSize().run();
                    }
                  }}
                  placeholder="Auto"
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                  min="8"
                  max="200"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => editor.chain().focus().setFontSize(size.toString()).run()}
                    className={`px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 ${
                      editor.getAttributes('textStyle').fontSize === size.toString()
                        ? 'bg-[#36463A] text-white border-[#36463A]'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetFontSize().run()}
                className="w-full px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                Reset to Default
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100 flex items-center gap-1"
              title="Font Family"
              style={{
                fontFamily: editor.getAttributes('textStyle').fontFamily || undefined,
              }}
            >
              <span className="text-xs">Aa</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto p-2">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Font Family</label>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().unsetFontFamily().run()}
                    className={`text-xs cursor-pointer ${
                      !editor.getAttributes('textStyle').fontFamily
                        ? 'bg-green-100 font-semibold'
                        : ''
                    }`}
                  >
                    Default
                  </DropdownMenuItem>
                  {CURATED_GOOGLE_FONTS.map((fontName) => (
                    <DropdownMenuItem
                      key={fontName}
                      onClick={() => editor.chain().focus().setFontFamily(fontName).run()}
                      className={`text-xs cursor-pointer ${
                        editor.getAttributes('textStyle').fontFamily === fontName
                          ? 'bg-green-100 font-semibold'
                          : ''
                      }`}
                      style={{ fontFamily: fontName }}
                    >
                      {fontName}
                    </DropdownMenuItem>
                  ))}
                  {customFonts.map((font) => (
                    <DropdownMenuItem
                      key={font.fontFamily}
                      onClick={() => editor.chain().focus().setFontFamily(font.fontFamily).run()}
                      className={`text-xs cursor-pointer ${
                        editor.getAttributes('textStyle').fontFamily === font.fontFamily
                          ? 'bg-green-100 font-semibold'
                          : ''
                      }`}
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.fontFamily}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Line Height Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100 flex items-center gap-1"
              title="Line Height"
            >
              <span className="text-xs">┃</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Line Height</label>
                <input
                  type="text"
                  value={editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight || ''}
                  onChange={(e) => {
                    const lineHeight = e.target.value;
                    if (lineHeight) {
                      editor.chain().focus().setLineHeight(lineHeight).run();
                    } else {
                      editor.chain().focus().unsetLineHeight().run();
                    }
                  }}
                  placeholder="Auto (e.g., 0.6, 1.5, 24px, 150%)"
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                />
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['0.6', '0.8', '1', '1.2', '1.5', '1.8', '2', '2.5'].map((lh) => {
                  const currentLineHeight = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight;
                  return (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => editor.chain().focus().setLineHeight(lh).run()}
                      className={`px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 ${
                        currentLineHeight === lh
                          ? 'bg-[#36463A] text-white border-[#36463A]'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {lh}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLineHeight().run()}
                className="w-full px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 bg-white text-gray-700"
              >
                Reset to Default
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Subscript & Superscript */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("subscript")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Subscript"
        >
          <SubscriptIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("superscript")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Superscript"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-green-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-green-300 mx-1" />

        {/* Headings & Paragraph */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100 flex items-center gap-1"
              title="Text Style"
            >
              <Type className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive("paragraph") ? "bg-green-100" : ""}
            >
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-green-100" : ""}
            >
              <Heading1 className="w-4 h-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-green-100" : ""}
            >
              <Heading2 className="w-4 h-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-green-100" : ""}
            >
              <Heading3 className="w-4 h-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              className={editor.isActive("heading", { level: 4 }) ? "bg-green-100" : ""}
            >
              Heading 4
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
              className={editor.isActive("heading", { level: 5 }) ? "bg-green-100" : ""}
            >
              Heading 5
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
              className={editor.isActive("heading", { level: 6 }) ? "bg-green-100" : ""}
            >
              Heading 6
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-green-300 mx-1" />

        {/* Lists */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100 flex items-center gap-1"
              title="Lists"
            >
              <List className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-green-100" : ""}
            >
              <List className="w-4 h-4 mr-2" />
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-green-100" : ""}
            >
              <ListOrdered className="w-4 h-4 mr-2" />
              Ordered List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive("taskList") ? "bg-green-100" : ""}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Task List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("blockquote")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-green-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            setLinkUrl(previousUrl || "");
            setShowLinkInput(true);
          }}
          className={`p-2 rounded text-sm transition-colors ${
            editor.isActive("link")
              ? "bg-[#36463A] text-white"
              : "bg-white text-[#36463A] hover:bg-green-100"
          }`}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Hard Break */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100"
          title="Line Break"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Emoji */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded text-sm transition-colors bg-white text-[#36463A] hover:bg-green-100"
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1 p-2">
              {["😀", "😂", "🥰", "😍", "🤔", "😎", "👍", "❤️", "🎉", "🔥", "⭐", "💯", "✅", "❌", "⚠️", "💡", "🎊", "🎁", "🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "💐", "🌿", "🍀", "🌱", "🌾", "🌵", "🌲", "🌳", "🌴", "🌊", "🌈", "☀️", "⭐", "🌟", "💫", "✨", "🌙", "☁️", "⛅", "🌤️", "🌦️", "🌧️", "⛈️", "🌩️", "⚡", "❄️", "☃️", "⛄", "🌨️", "💨", "🌪️", "🌫️"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="p-2 hover:bg-green-100 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Link Input Dialog */}
      {showLinkInput && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-green-200 rounded-b-xl p-3 shadow-lg">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="flex-1 px-3 py-2 border border-green-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#36463A]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLink();
                } else if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={setLink}
              className="px-4 py-2 bg-[#36463A] text-white rounded text-sm hover:bg-[#2d3a2f]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative" ref={editorContainerRef}>
        <div
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onKeyPress={(e) => {
            e.stopPropagation();
          }}
          onKeyUp={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onFocus={(e) => {
            e.stopPropagation();
          }}
          onBlur={(e) => {
            e.stopPropagation();
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>

    {/* Gradient Picker Dialog */}
    {(fontColor !== undefined || onFontColorChange) && (
      <Dialog open={showGradientPicker} onOpenChange={setShowGradientPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🎨 Gradient Text Color</DialogTitle>
            <DialogDescription>
              Choose two colors and direction for your gradient text
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {/* Color 1 */}
              <div className="space-y-2">
                <label htmlFor="gradientColor1Picker" className="text-sm font-medium">Color 1 (Start)</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: gradientColor1 }}
                    />
                    <input
                      id="gradientColor1Picker"
                      name="gradientColor1Picker"
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id="gradientColor1Text"
                      name="gradientColor1Text"
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>
              </div>

              {/* Color 2 */}
              <div className="space-y-2">
                <label htmlFor="gradientColor2Picker" className="text-sm font-medium">Color 2 (End)</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <div
                      className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: gradientColor2 }}
                    />
                    <input
                      id="gradientColor2Picker"
                      name="gradientColor2Picker"
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ WebkitAppearance: "none", appearance: "none" }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id="gradientColor2Text"
                      name="gradientColor2Text"
                      type="text"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#36463A]"
                      placeholder="#0000ff"
                    />
                  </div>
                </div>
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <label htmlFor="gradientDirection" className="text-sm font-medium">Direction</label>
                <select
                  id="gradientDirection"
                  name="gradientDirection"
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#36463A]"
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
                  className="w-full h-16 rounded border border-gray-300 flex items-center justify-center text-xl font-semibold"
                  style={{ 
                    background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Gradient Text Preview
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowGradientPicker(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={applyGradient}
              className="px-4 py-2 text-sm bg-[#36463A] text-white rounded hover:bg-[#2d3a2f]"
            >
              Apply Gradient
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </div>
  );
}
