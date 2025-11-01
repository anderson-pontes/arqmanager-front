import type { Proposta } from '@/types';
import { mockClientes } from './mockClientes';
import { mockServicos } from './mockServicos';

export const mockPropostas: Proposta[] = [
    {
        id: 1,
        numero: '001',
        ano: 2024,
        cliente: mockClientes[0],
        servico: mockServicos[0],
        status: 'Em Análise',
        identificacao: 'Residência João Santos',
        descricao: 'Projeto arquitetônico para residência unifamiliar de 250m²',
        valorProposta: 45000.0,
        valorParcelaAprazo: 5000.0,
        dataProposta: '2024-10-15',
        observacao: 'Cliente solicitou prazo reduzido',
        etapas: [
            {
                etapa: mockServicos[0].etapas[0],
                prazo: 15,
                dataPrevista: '2024-11-15',
                descricao: 'Estudo preliminar com 3 opções',
            },
            {
                etapa: mockServicos[0].etapas[1],
                prazo: 20,
                dataPrevista: '2024-12-05',
                descricao: 'Anteprojeto detalhado',
            },
        ],
    },
    {
        id: 2,
        numero: '002',
        ano: 2024,
        cliente: mockClientes[1],
        servico: mockServicos[1],
        status: 'Aprovada',
        identificacao: 'Escritório Maria Construções',
        descricao: 'Projeto de interiores para escritório corporativo',
        valorProposta: 28000.0,
        valorParcelaAprazo: 3500.0,
        dataProposta: '2024-10-20',
        observacao: '',
        etapas: [
            {
                etapa: mockServicos[1].etapas[0],
                prazo: 10,
                dataPrevista: '2024-11-10',
                descricao: 'Briefing e levantamento',
            },
            {
                etapa: mockServicos[1].etapas[1],
                prazo: 15,
                dataPrevista: '2024-11-25',
                descricao: 'Desenvolvimento do conceito',
            },
        ],
    },
];
