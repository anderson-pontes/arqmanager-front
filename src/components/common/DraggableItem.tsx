import { ReactNode, useState } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
    id: string | number;
    children: ReactNode;
    onDragStart?: (id: string | number) => void;
    onDragEnd?: () => void;
    onDrop?: (targetId: string | number) => void;
    className?: string;
    disabled?: boolean;
}

export function DraggableItem({
    id,
    children,
    onDragStart,
    onDragEnd,
    onDrop,
    className,
    disabled = false,
}: DraggableItemProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(id));
        onDragStart?.(id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setIsDragOver(false);
        onDragEnd?.();
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragOver(false);
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId !== String(id)) {
            onDrop?.(id);
        }
    };

    return (
        <div
            draggable={!disabled}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                'relative transition-all',
                isDragging && 'opacity-50',
                isDragOver && 'ring-2 ring-primary ring-offset-2',
                disabled && 'cursor-not-allowed opacity-60',
                !disabled && 'cursor-move',
                className
            )}
        >
            {!disabled && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            {children}
        </div>
    );
}

