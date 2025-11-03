import type { CategoriaFinanceira } from '@/types';

export const mockCategorias: CategoriaFinanceira[] = [
    // Receitas
    {
        id: 1,
        nome: 'Projetos',
        tipo: 'Receita',
        cor: '#28A745',
        ativo: true,
    },
    {
        id: 2,
        nome: 'Consultorias',
        tipo: 'Receita',
        cor: '#17A2B8',
        ativo: true,
    },
    {
        id: 3,
        nome: 'Outras Receitas',
        tipo: 'Receita',
        cor: '#6C757D',
        ativo: true,
    },
    // Despesas
    {
        id: 4,
        nome: 'Salários',
        tipo: 'Despesa',
        cor: '#DC3545',
        ativo: true,
    },
    {
        id: 5,
        nome: 'Aluguel',
        tipo: 'Despesa',
        cor: '#FD7E14',
        ativo: true,
    },
    {
        id: 6,
        nome: 'Fornecedores',
        tipo: 'Despesa',
        cor: '#E83E8C',
        ativo: true,
    },
    {
        id: 7,
        nome: 'Impostos',
        tipo: 'Despesa',
        cor: '#6610F2',
        ativo: true,
    },
    {
        id: 8,
        nome: 'Marketing',
        tipo: 'Despesa',
        cor: '#20C997',
        ativo: true,
    },
    {
        id: 9,
        nome: 'Despesas Gerais',
        tipo: 'Despesa',
        cor: '#6C757D',
        ativo: true,
    },
];
