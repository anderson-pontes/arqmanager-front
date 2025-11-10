import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    showBack?: boolean;
    backUrl?: string;
}

export function PageHeader({
    title,
    description,
    action,
    showBack = false,
    backUrl,
}: PageHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                {showBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground text-sm mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
