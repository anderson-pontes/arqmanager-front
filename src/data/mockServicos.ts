import type { Servico } from '@/types';

export const mockServicos: Servico[] = [
    {
        id: 1,
        nome: 'Projeto Arquitetônico Residencial',
        descricao: 'Projeto completo de arquitetura residencial',
        ativo: true,
        etapas: [
            {
                id: 1,
                nome: 'Estudo Preliminar',
                descricao: 'Desenvolvimento do estudo preliminar',
                ordem: 1,
            },
            {
                id: 2,
                nome: 'Anteprojeto',
                descricao: 'Desenvolvimento do anteprojeto',
                ordem: 2,
            },
            {
                id: 3,
                nome: 'Projeto Legal',
                descricao: 'Projeto para aprovação na prefeitura',
                ordem: 3,
            },
            {
                id: 4,
                nome: 'Projeto Executivo',
                descricao: 'Projeto detalhado para execução',
                ordem: 4,
            },
        ],
    },
    {
        id: 2,
        nome: 'Projeto de Interiores',
        descricao: 'Projeto completo de design de interiores',
        ativo: true,
        etapas: [
            {
                id: 5,
                nome: 'Briefing',
                descricao: 'Levantamento de necessidades',
                ordem: 1,
            },
            {
                id: 6,
                nome: 'Conceito',
                descricao: 'Desenvolvimento do conceito',
                ordem: 2,
            },
            {
                id: 7,
                nome: 'Projeto Detalhado',
                descricao: 'Detalhamento do projeto',
                ordem: 3,
            },
        ],
    },
];
