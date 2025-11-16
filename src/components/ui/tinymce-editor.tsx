import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';

interface TinyMCEEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function TinyMCEEditor({
    content = '',
    onChange,
    placeholder = 'Digite aqui...',
    className,
    disabled = false,
}: TinyMCEEditorProps) {
    const editorRef = useRef<any>(null);

    const handleEditorChange = (content: string) => {
        onChange?.(content);
    };

    return (
        <div className={cn('border rounded-md overflow-hidden', className)}>
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                value={content}
                onEditorChange={handleEditorChange}
                disabled={disabled}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'code',
                        'help',
                        'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    placeholder: placeholder,
                    branding: false,
                    promotion: false,
                    language: 'pt_BR',
                    skin: 'oxide',
                    content_css: 'default',
                }}
            />
        </div>
    );
}

