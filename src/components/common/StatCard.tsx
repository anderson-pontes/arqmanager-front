import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
    bgColor?: string;
    onClick?: () => void;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'text-blue-600',
    bgColor = 'bg-blue-100',
    onClick,
}: StatCardProps) {
    return (
        <Card
            className={cn(
                'transition-all',
                onClick && 'cursor-pointer hover:shadow-md'
            )}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={cn('p-2 rounded-lg', bgColor)}>
                    <Icon className={cn('h-4 w-4', color)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        <span
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {trend.isPositive ? '+' : ''}
                            {trend.value}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                            vs. mês anterior
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
