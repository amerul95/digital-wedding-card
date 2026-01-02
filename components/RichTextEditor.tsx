"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
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

  if (!mounted || !editor) {
    return (
      <div className="border border-rose-200 rounded-xl overflow-hidden min-h-[150px] p-3 bg-white">
        <div className="text-sm text-rose-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-rose-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-300 relative">
      <div className="border-b border-rose-200 bg-rose-50 p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("bold")
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-700 hover:bg-rose-100"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("italic")
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-700 hover:bg-rose-100"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("bulletList")
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-700 hover:bg-rose-100"
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("orderedList")
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-700 hover:bg-rose-100"
          }`}
        >
          1.
        </button>
      </div>
      <div className="relative">
        <EditorContent editor={editor} />
        {placeholder && !editor.getText() && (
          <div className="absolute top-0 left-0 pointer-events-none text-rose-400 text-sm p-3">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}

