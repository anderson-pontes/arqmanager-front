import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config/api';

export interface LoginRequest {
    email: string;
    senha: string; // Backend espera 'senha', não 'password'
}

export interface LoginResponse {
    user: {
        id: number;
        nome: string;
        email: string;
        perfil: string;
        is_system_admin: boolean;
        escritorios: any[];
    };
    access_token: string;
    refresh_token: string;
    token_type: string;
    requires_escritorio_selection: boolean;
    is_system_admin: boolean;
    available_escritorios: Array<{
        id: number;
        nome_fantasia: string;
        razao_social: string;
        cor: string;
        perfil?: string | null;
    }>;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    /**
     * Realiza login do usuário
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post(API_ENDPOINTS.auth.login, data);
        return response.data;
    },

    /**
     * Realiza logout do usuário
     */
    async logout(): Promise<void> {
        await apiClient.post(API_ENDPOINTS.auth.logout);
    },

    /**
     * Renova o token de acesso
     */
    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        const response = await apiClient.post(API_ENDPOINTS.auth.refresh, {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    /**
     * Salva tokens no localStorage
     */
    saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    /**
     * Remove tokens do localStorage
     */
    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    /**
     * Verifica se usuário está autenticado
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Obtém token de acesso
     */
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    /**
     * Define contexto de escritório e perfil
     * Se escritorioId e perfil forem null, define modo administrativo
     */
    async setContext(escritorioId: number | null | undefined, perfil: string | null | undefined) {
        const response = await apiClient.post(API_ENDPOINTS.auth.setContext, {
            escritorio_id: escritorioId ?? null,
            perfil: perfil ?? null
        });
        return response.data;
    },

    /**
     * Obtém lista de escritórios disponíveis
     */
    async getAvailableEscritorios() {
        const response = await apiClient.get(API_ENDPOINTS.auth.availableEscritorios);
        return response.data;
    },
};
