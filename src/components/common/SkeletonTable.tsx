import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonTableProps {
    columns?: number;
    rows?: number;
}

export function SkeletonTable({ columns = 5, rows = 5 }: SkeletonTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Array.from({ length: columns }).map((_, i) => (
                        <TableHead key={i}>
                            <Skeleton className="h-4 w-24" />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-4 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
