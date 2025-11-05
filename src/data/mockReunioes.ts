import type { Reuniao, ReuniaoManifestacao } from '@/types';

export const mockManifestacoes: ReuniaoManifestacao[] = [
    {
        id: 1,
        reuniaoId: 1,
        autor: 'João Silva',
        data: '2024-11-05T10:30:00',
        tipo: 'Escritório',
        mensagem: 'Confirmamos a reunião para discussão do projeto.',
    },
    {
        id: 2,
        reuniaoId: 1,
        autor: 'Maria Santos',
        data: '2024-11-05T14:20:00',
        tipo: 'Cliente',
        mensagem: 'Perfeito! Estarei presente.',
    },
];

export const mockReunioes: Reuniao[] = [
    {
        id: 1,
        projeto: {
            id: 1,
            numero: '2024/001',
            cliente: 'João Silva',
        },
        data: '2024-11-10T14:00:00',
        dataCliente: '2024-11-10T14:00:00',
        deAcordo: true,
        observacao: 'Reunião para apresentação do projeto arquitetônico',
        participantes: ['Ana Silva', 'João Silva'],
        local: 'Escritório',
        status: 'Confirmada',
        manifestacoes: mockManifestacoes.filter((m) => m.reuniaoId === 1),
        ata: 'Ata da reunião realizada em 10/11/2024...',
    },
    {
        id: 2,
        projeto: {
            id: 2,
            numero: '2024/002',
            cliente: 'Maria Santos',
        },
        data: '2024-11-15T10:00:00',
        deAcordo: false,
        observacao: 'Reunião para ajustes no projeto',
        participantes: ['Carlos Oliveira', 'Maria Santos'],
        local: 'Online',
        status: 'Pendente',
        manifestacoes: [],
    },
    {
        id: 3,
        projeto: {
            id: 3,
            numero: '2024/003',
            cliente: 'Pedro Costa',
        },
        data: '2024-11-20T16:00:00',
        deAcordo: true,
        observacao: 'Reunião de acompanhamento da obra',
        participantes: ['Ana Silva', 'Pedro Costa'],
        local: 'Canteiro de obras',
        status: 'Confirmada',
        manifestacoes: [],
    },
];
