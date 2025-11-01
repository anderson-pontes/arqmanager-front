import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Escritorio } from '@/types';

interface EscritorioState {
    escritorio: Escritorio | null;
    setEscritorio: (escritorio: Escritorio) => void;
    clearEscritorio: () => void;
}

export const useEscritorioStore = create<EscritorioState>()(
    persist(
        (set) => ({
            escritorio: null,

            setEscritorio: (escritorio) => set({ escritorio }),

            clearEscritorio: () => set({ escritorio: null }),
        }),
        {
            name: 'escritorio-storage',
        }
    )
);
