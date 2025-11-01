import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS } from '@/config/constants';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
    const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS];

    return (
        <Badge
            variant={variant}
            style={{
                backgroundColor: color,
                color: '#fff',
                borderColor: color,
            }}
        >
            {status}
        </Badge>
    );
}
