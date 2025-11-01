import type { Dashboard } from '@/types';
import { mockProjetos } from './mockProjetos';

export const mockDashboard: Dashboard = {
    estatisticas: {
        projetosAtivos: 12,
        projetosAtrasados: 3,
        propostasPendentes: 5,
        receitaMes: 85000.0,
        receitaPrevista: 120000.0,
    },
    projetosAndamento: mockProjetos,
    projetosAtrasados: [
        {
            id: 5,
            numero: '005/2024',
            cliente: 'Cliente Exemplo',
            diasAtraso: 7,
            etapaAtrasada: 'Projeto Legal',
        },
    ],
    aniversariantes: [
        {
            nome: 'João Pedro Santos',
            data: '10/11',
            tipo: 'cliente',
        },
        {
            nome: 'Beatriz Costa',
            data: '30/11',
            tipo: 'colaborador',
        },
    ],
    pagamentosPendentes: [
        {
            projeto: '001/2024',
            cliente: 'Roberto Almeida',
            valor: 10000.0,
            vencimento: '2024-11-01',
            diasAtraso: 0,
        },
    ],
};
