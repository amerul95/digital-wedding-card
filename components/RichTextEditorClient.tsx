"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

interface RichTextEditorClientProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditorClient({ 
  content, 
  onChange, 
  placeholder = "Write your text here...",
}: RichTextEditorClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Only enable paragraph and hard break for line breaks
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        // Keep paragraph and hardBreak for text and line breaks
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-3 border border-gray-300 rounded-md",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Allow Enter for line breaks
          if (event.key === 'Enter' && !event.shiftKey) {
            // Insert hard break on Enter
            return false; // Let TipTap handle it
          }
          // Prevent form submission
          if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            return true;
          }
          event.stopPropagation();
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
