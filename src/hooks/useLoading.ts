import { useState, useEffect } from 'react';

export function useLoading(delay: number = 1000) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return isLoading;
}

export function useAsyncAction() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = async <T>(action: () => Promise<T>): Promise<T | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await action();
            return result;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, execute };
}
