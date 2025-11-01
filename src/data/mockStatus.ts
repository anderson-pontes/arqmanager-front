import type { Status } from '@/types';

export const mockStatus: Status[] = [
    { id: 1, nome: 'Em Análise', cor: '#FFA500', tipo: 'proposta' },
    { id: 2, nome: 'Aprovada', cor: '#28A745', tipo: 'proposta' },
    { id: 3, nome: 'Rejeitada', cor: '#DC3545', tipo: 'proposta' },
    { id: 4, nome: 'Aguardando Cliente', cor: '#FFC107', tipo: 'proposta' },
    { id: 5, nome: 'Em Andamento', cor: '#007BFF', tipo: 'projeto' },
    { id: 6, nome: 'Pausado', cor: '#6C757D', tipo: 'projeto' },
    { id: 7, nome: 'Concluído', cor: '#28A745', tipo: 'projeto' },
    { id: 8, nome: 'Cancelado', cor: '#DC3545', tipo: 'projeto' },
    { id: 9, nome: 'Atrasado', cor: '#DC3545', tipo: 'projeto' },
];
