import type { TermoEntrega } from '@/types';

export const mockTermosEntrega: TermoEntrega[] = [
    {
        id: 1,
        projetoId: 1,
        dataEntrega: '2024-04-15',
        responsavelEntrega: 'Ana Silva',
        responsavelRecebimento: 'João Silva',
        itensEntregues: [
            'Projeto Arquitetônico Completo (PDF e DWG)',
            'Memorial Descritivo',
            'Planilha Orçamentária',
            'Cronograma de Execução',
            'RRT do Projeto',
        ],
        observacao: 'Todos os documentos foram entregues conforme contrato',
        assinaturaEscritorio: 'Ana Silva - Arquiteta CAU A12345-6',
        assinaturaCliente: 'João Silva - CPF 123.456.789-00',
        status: 'Assinado',
    },
    {
        id: 2,
        projetoId: 2,
        dataEntrega: '2024-05-20',
        responsavelEntrega: 'Carlos Oliveira',
        responsavelRecebimento: 'Maria Santos',
        itensEntregues: [
            'Projeto de Interiores',
            'Especificações Técnicas',
            'Perspectivas 3D',
        ],
        observacao: 'Aguardando assinatura do cliente',
        status: 'Pendente',
    },
];
