// Dados mock para relatórios e gráficos

export interface FaturamentoMensal {
    mes: string;
    previsto: number;
    recebido: number;
    ano: number;
}

export interface FaturamentoPorCategoria {
    categoria: string;
    valor: number;
    cor: string;
}

export interface ComparativoAnual {
    ano: number;
    receitas: number;
    despesas: number;
    lucro: number;
}

export const mockFaturamentoMensal: FaturamentoMensal[] = [
    { mes: 'Jan', previsto: 45000, recebido: 42000, ano: 2024 },
    { mes: 'Fev', previsto: 52000, recebido: 48000, ano: 2024 },
    { mes: 'Mar', previsto: 48000, recebido: 51000, ano: 2024 },
    { mes: 'Abr', previsto: 55000, recebido: 53000, ano: 2024 },
    { mes: 'Mai', previsto: 60000, recebido: 58000, ano: 2024 },
    { mes: 'Jun', previsto: 58000, recebido: 62000, ano: 2024 },
    { mes: 'Jul', previsto: 65000, recebido: 61000, ano: 2024 },
    { mes: 'Ago', previsto: 62000, recebido: 64000, ano: 2024 },
    { mes: 'Set', previsto: 70000, recebido: 68000, ano: 2024 },
    { mes: 'Out', previsto: 68000, recebido: 72000, ano: 2024 },
    { mes: 'Nov', previsto: 75000, recebido: 45000, ano: 2024 },
    { mes: 'Dez', previsto: 80000, recebido: 0, ano: 2024 },
];

export const mockFaturamentoReceitas: FaturamentoPorCategoria[] = [
    { categoria: 'Projetos Arquitetônicos', valor: 285000, cor: '#3B82F6' },
    { categoria: 'Projetos de Interiores', valor: 165000, cor: '#8B5CF6' },
    { categoria: 'Consultoria', valor: 85000, cor: '#10B981' },
    { categoria: 'Acompanhamento de Obra', valor: 95000, cor: '#F59E0B' },
    { categoria: 'Projetos Complementares', valor: 54000, cor: '#EF4444' },
];

export const mockFaturamentoDespesas: FaturamentoPorCategoria[] = [
    { categoria: 'Folha de Pagamento', valor: 180000, cor: '#EF4444' },
    { categoria: 'Aluguel e Condomínio', valor: 48000, cor: '#F59E0B' },
    { categoria: 'Software e Licenças', valor: 24000, cor: '#8B5CF6' },
    { categoria: 'Marketing', valor: 36000, cor: '#3B82F6' },
    { categoria: 'Impostos', valor: 72000, cor: '#6B7280' },
    { categoria: 'Outros', valor: 28000, cor: '#10B981' },
];

export const mockComparativoAnual: ComparativoAnual[] = [
    { ano: 2020, receitas: 420000, despesas: 310000, lucro: 110000 },
    { ano: 2021, receitas: 520000, despesas: 365000, lucro: 155000 },
    { ano: 2022, receitas: 615000, despesas: 425000, lucro: 190000 },
    { ano: 2023, receitas: 680000, despesas: 468000, lucro: 212000 },
    { ano: 2024, receitas: 684000, despesas: 388000, lucro: 296000 },
];

export const mockFaturamentoPorProjeto = [
    {
        projeto: '2024/001',
        cliente: 'João Silva',
        valor: 48000,
        status: 'Concluído',
    },
    {
        projeto: '2024/002',
        cliente: 'Maria Santos',
        valor: 35000,
        status: 'Em Andamento',
    },
    {
        projeto: '2024/003',
        cliente: 'Pedro Costa',
        valor: 62000,
        status: 'Concluído',
    },
    {
        projeto: '2024/004',
        cliente: 'Ana Oliveira',
        valor: 28000,
        status: 'Em Andamento',
    },
    {
        projeto: '2024/005',
        cliente: 'Carlos Souza',
        valor: 45000,
        status: 'Concluído',
    },
    {
        projeto: '2024/006',
        cliente: 'Juliana Lima',
        valor: 52000,
        status: 'Em Andamento',
    },
    {
        projeto: '2024/007',
        cliente: 'Roberto Alves',
        valor: 38000,
        status: 'Concluído',
    },
    {
        projeto: '2024/008',
        cliente: 'Fernanda Rocha',
        valor: 71000,
        status: 'Em Andamento',
    },
];

export const mockFaturamentoPorCliente = [
    { cliente: 'João Silva', projetos: 3, valorTotal: 125000 },
    { cliente: 'Maria Santos', projetos: 2, valorTotal: 87000 },
    { cliente: 'Pedro Costa', projetos: 2, valorTotal: 95000 },
    { cliente: 'Ana Oliveira', projetos: 1, valorTotal: 28000 },
    { cliente: 'Carlos Souza', projetos: 2, valorTotal: 78000 },
    { cliente: 'Juliana Lima', projetos: 1, valorTotal: 52000 },
    { cliente: 'Roberto Alves', projetos: 1, valorTotal: 38000 },
    { cliente: 'Fernanda Rocha', projetos: 1, valorTotal: 71000 },
];

export const mockMetricasGerais = {
    faturamentoTotal2024: 684000,
    faturamentoMedio: 57000,
    ticketMedio: 46285,
    projetosFinalizados: 12,
    projetosEmAndamento: 8,
    taxaCrescimento: 12.5,
    margemLucro: 43.3,
    receitasPendentes: 125000,
};
