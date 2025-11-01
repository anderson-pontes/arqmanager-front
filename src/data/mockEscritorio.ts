import type { Escritorio } from '@/types';

export const mockEscritorio: Escritorio = {
    id: 1,
    nomeFantasia: 'Arquitetura & Design Ltda',
    razaoSocial: 'Arquitetura e Design Projetos Ltda',
    documento: '12.345.678/0001-90',
    email: 'contato@arquiteturadesign.com.br',
    telefone: '(11) 3456-7890',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    cor: '#0066CC',
    diasUteis: true,
    prazoArquivaProposta: 30,
    observacaoPropostaPadrao:
        'Prazo em #CORRIDOS_UTEIS# a partir da aprovação do projeto.',
    observacaoContratoPadrao: 'Pagamento conforme cronograma estabelecido.',
};
