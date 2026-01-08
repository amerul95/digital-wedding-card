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
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    setMounted(true);
  }, []);

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
      },
    },
  }, [mounted]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Sync text color with editor's current color
  useEffect(() => {
    if (editor) {
      const currentColor = editor.getAttributes("textStyle").color;
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

  if (!mounted || !editor) {
    return (
      <div className="border border-green-200 rounded-xl overflow-hidden min-h-[150px] p-3 bg-white">
        <div className="text-sm text-green-600">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-green-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-300 relative">
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
                      onChange={(e) => {
                        setTextColor(e.target.value);
                        editor.chain().focus().setColor(e.target.value).run();
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      editor.chain().focus().setColor(e.target.value).run();
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
                    onClick={() => {
                      setTextColor(color);
                      editor.chain().focus().setColor(color).run();
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
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
