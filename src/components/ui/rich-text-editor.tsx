import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Button } from './button';

interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function RichTextEditor({
    content = '',
    onChange,
    placeholder = 'Digite aqui...',
    className,
    disabled = false,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Inicializar conteúdo apenas na montagem
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content || '';
        }
    }, []); // Apenas na montagem

    // Atualizar conteúdo quando mudar externamente (mas não durante edição)
    useEffect(() => {
        if (editorRef.current && content !== undefined) {
            const currentContent = editorRef.current.innerHTML;
            // Só atualizar se for diferente e não estiver vazio (para evitar sobrescrever durante edição)
            if (content !== currentContent && content !== '') {
                const isEditing = document.activeElement === editorRef.current;
                if (!isEditing) {
                    editorRef.current.innerHTML = content || '';
                }
            }
        }
    }, [content]);

    const handleInput = () => {
        if (editorRef.current && onChange) {
            const html = editorRef.current.innerHTML;
            onChange(html);
            
            // Adicionar ao histórico
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(html);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput();
        }
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleUndo = () => {
        if (canUndo && editorRef.current) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            editorRef.current.innerHTML = history[newIndex];
            onChange?.(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (canRedo && editorRef.current) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            editorRef.current.innerHTML = history[newIndex];
            onChange?.(history[newIndex]);
        }
    };

    const isActive = (command: string) => {
        return document.queryCommandState(command);
    };

    return (
        <div className={cn('border rounded-md', className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('bold')}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-8 p-0',
                        isActive('bold') && 'bg-gray-200'
                    )}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('italic')}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-8 p-0',
                        isActive('italic') && 'bg-gray-200'
                    )}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('insertUnorderedList')}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-8 p-0',
                        isActive('insertUnorderedList') && 'bg-gray-200'
                    )}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => execCommand('insertOrderedList')}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-8 p-0',
                        isActive('insertOrderedList') && 'bg-gray-200'
                    )}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={disabled || !canUndo}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={disabled || !canRedo}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    className="prose prose-sm max-w-none focus:outline-none min-h-[150px] [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-gray-400 [&:empty:before]:opacity-50"
                    data-placeholder={placeholder}
                    suppressContentEditableWarning
                    style={{
                        outline: 'none',
                    }}
                />
            </div>
        </div>
    );
}

