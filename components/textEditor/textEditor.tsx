'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menu-bar'
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  post:String
  onChange:(post:string) => void
}

const Tiptap = ({post,onChange}:RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList:{
          HTMLAttributes:{
            class:"list-disc ml-3"
          }
        },
        orderedList:{
          HTMLAttributes:{
            class:"list-decimal ml-3"
          }
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight
    ],
    content: post,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps:{
        attributes:{
            class:"min-h-[156px] border rounded-md bg-slate-50 py-2 px-3"
        }
    },
    onUpdate:({editor})=>{
      // console.log(editor.getHTML())
      onChange(editor.getHTML());
    }
  })

  return (
    <div>
        <MenuBar editor={editor}/>
        <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap