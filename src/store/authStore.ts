import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type UserEscritorio } from '@/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    requiresEscritorioSelection: boolean;
    setAuth: (
        user: User,
        accessToken: string,
        refreshToken: string,
        requiresSelection?: boolean
    ) => void;
    setEscritorioAtual: (escritorio: UserEscritorio) => void;
    clearAuth: () => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            requiresEscritorioSelection: false,

            setAuth: (
                user,
                accessToken,
                refreshToken,
                requiresSelection = false
            ) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // Se o usuário tem múltiplos escritórios e não tem um selecionado
                const needsSelection =
                    requiresSelection ||
                    (user.escritorios.length > 1 && !user.escritorioId);

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    requiresEscritorioSelection: needsSelection,
                });
            },

            setEscritorioAtual: (escritorio: UserEscritorio) => {
                set((state) => {
                    if (!state.user) return state;

                    return {
                        user: {
                            ...state.user,
                            escritorioId: escritorio.escritorio.id,
                            escritorioAtual: escritorio.escritorio,
                            perfil: escritorio.perfil, // Atualiza o perfil para o do escritório
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
            }),
        }
    )
);
