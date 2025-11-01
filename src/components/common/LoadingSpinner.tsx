import { Spinner } from '@/components/ui/spinner';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
}

export function LoadingSpinner({
    fullScreen = false,
    message = 'Carregando...',
}: LoadingSpinnerProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
                <Spinner />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}
