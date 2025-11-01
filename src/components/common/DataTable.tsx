import { ReactNode } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty } from '@/components/ui/empty';

interface Column<T> {
    key: string;
    title: string;
    render?: (item: T) => ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    loading = false,
    emptyMessage = 'Nenhum registro encontrado',
    onRowClick,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return <Empty description={emptyMessage} />;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key} style={{ width: column.width }}>
                                {column.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow
                            key={item.id}
                            className={onRowClick ? 'cursor-pointer' : ''}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((column) => (
                                <TableCell key={column.key}>
                                    {column.render
                                        ? column.render(item)
                                        : String((item as any)[column.key] || '-')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
