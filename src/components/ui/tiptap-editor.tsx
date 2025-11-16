import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Button } from './button';
import { useEffect } from 'react';

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function TiptapEditor({
    content = '',
    onChange,
    placeholder = 'Digite aqui...',
    className,
    disabled = false,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: content || '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
    });

    // Atualizar conteúdo quando mudar externamente
    useEffect(() => {
        if (editor && content !== undefined) {
            const currentContent = editor.getHTML();
            if (content !== currentContent) {
                editor.commands.setContent(content || '');
            }
        }
    }, [content, editor]);

    // Cleanup ao desmontar
    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [editor]);

    if (!editor) {
        return (
            <div className={cn('border rounded-md p-4 min-h-[200px] bg-gray-50 flex items-center justify-center', className)}>
                <p className="text-gray-500 text-sm">Carregando editor...</p>
            </div>
        );
    }

    return (
        <div className={cn('border rounded-md', className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bold') && 'bg-gray-200'
                    )}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('italic') && 'bg-gray-200'
                    )}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bulletList') && 'bg-gray-200'
                    )}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('orderedList') && 'bg-gray-200'
                    )}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror_placeholder]:text-gray-400 [&_.ProseMirror_placeholder]:opacity-50"
                />
            </div>
        </div>
    );
}

