import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type UserEscritorio } from '@/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    requiresEscritorioSelection: boolean;
    isSystemAdmin: boolean;  // NOVO
    isAdminMode: boolean;  // Modo administrativo (sem escritório)
    currentContext: {  // NOVO
        escritorioId?: number;
        perfil?: string;
    };
    setAuth: (
        user: User,
        accessToken: string,
        refreshToken: string,
        requiresSelection?: boolean,
        isSystemAdmin?: boolean  // NOVO
    ) => void;
    setContext: (escritorioId?: number | null, perfil?: string | null) => Promise<void>;  // NOVO - aceita null para modo admin
    setAdminMode: () => Promise<void>;  // NOVO - define modo administrativo
    setEscritorioAtual: (escritorio: UserEscritorio) => void;
    clearAuth: () => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            requiresEscritorioSelection: false,
            isSystemAdmin: false,  // NOVO
            isAdminMode: false,  // Modo administrativo
            currentContext: {},  // NOVO

            setAuth: (
                user,
                accessToken,
                refreshToken,
                requiresSelection = false,
                isSystemAdmin = false  // NOVO
            ) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                const needsSelection =
                    requiresSelection ||
                    (user.escritorios.length > 1 && !user.escritorioId) ||
                    isSystemAdmin;  // Admin sempre precisa selecionar

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    requiresEscritorioSelection: needsSelection,
                    isSystemAdmin,  // NOVO
                });
            },

            setContext: async (escritorioId?: number | null, perfil?: string | null) => {
                const { accessToken, refreshToken } = get();
                if (!accessToken) {
                    throw new Error('Token não encontrado');
                }

                try {
                    const { authService } = await import('@/api/services/auth.service');
                    const response = await authService.setContext(escritorioId ?? null, perfil ?? null);
                    
                    // Atualizar token
                    authService.saveTokens(response.access_token, refreshToken || '');
                    
                    const isAdminMode = response.is_admin_mode || false;
                    
                    set((state) => ({
                        currentContext: isAdminMode ? {} : { escritorioId: escritorioId || undefined, perfil: perfil || undefined },
                        accessToken: response.access_token,
                        requiresEscritorioSelection: false,
                        isAdminMode: isAdminMode,
                        user: state.user ? {
                            ...state.user,
                            escritorioId: isAdminMode ? undefined : (escritorioId || undefined),
                            perfil: isAdminMode ? undefined : (perfil || undefined)
                        } : null
                    }));
                } catch (error) {
                    console.error('Erro ao definir contexto:', error);
                    throw error;
                }
            },

            setAdminMode: async () => {
                await get().setContext(null, null);
            },

            setEscritorioAtual: (escritorio: UserEscritorio) => {
                set((state) => {
                    if (!state.user) return state;

                    return {
                        user: {
                            ...state.user,
                            escritorioId: escritorio.escritorio.id,
                            escritorioAtual: escritorio.escritorio,
                            perfil: escritorio.perfil,
                        },
                        currentContext: {
                            escritorioId: escritorio.escritorio.id,
                            perfil: escritorio.perfil
                        },
                        requiresEscritorioSelection: false,
                    };
                });
            },

            clearAuth: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    requiresEscritorioSelection: false,
                    isSystemAdmin: false,
                    isAdminMode: false,
                    currentContext: {},
                });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    requiresEscritorioSelection: false,
                    isSystemAdmin: false,
                    isAdminMode: false,
                    currentContext: {},
                });
            },

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'auth-storage',
                    partialize: (state) => ({
                        user: state.user,
                        isAuthenticated: state.isAuthenticated,
                        requiresEscritorioSelection: state.requiresEscritorioSelection,
                        isSystemAdmin: state.isSystemAdmin,
                        isAdminMode: state.isAdminMode,
                        currentContext: state.currentContext,
                    }),
        }
    )
);
