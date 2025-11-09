import { useState } from 'react';
import { authService, type LoginRequest } from '@/api/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/utils/errorHandler';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            authService.saveTokens(
                response.access_token,
                response.refresh_token
            );

            // Salva dados do usuário
            localStorage.setItem('user', JSON.stringify(response.user));

            return response;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err, 'Erro ao fazer login');
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
        } finally {
            authService.clearTokens();
            localStorage.removeItem('user');
            setLoading(false);
            navigate('/login');
        }
    };

    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    const getUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    return {
        login,
        logout,
        isAuthenticated,
        getUser,
        loading,
        error,
    };
};
