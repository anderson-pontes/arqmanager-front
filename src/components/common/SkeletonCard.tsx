import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
    hasHeader?: boolean;
    lines?: number;
}

export function SkeletonCard({ hasHeader = true, lines = 3 }: SkeletonCardProps) {
    return (
        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
            {hasHeader && (
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
            )}
            <CardContent className={hasHeader ? '' : 'pt-6'}>
                <div className="space-y-3">
                    {Array.from({ length: lines }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function SkeletonStatCard() {
    return (
        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
        </Card>
    );
}
