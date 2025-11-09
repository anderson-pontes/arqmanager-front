import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config/api';

export interface Cliente {
    id: number;
    nome: string;
    email?: string;
    telefone?: string;
    cpf_cnpj?: string;
    tipo_pessoa: 'fisica' | 'juridica';
    data_nascimento?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    observacoes?: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClienteCreate {
    nome: string;
    email?: string;
    telefone?: string;
    cpf_cnpj?: string;
    tipo_pessoa: 'fisica' | 'juridica';
    data_nascimento?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    observacoes?: string;
    ativo?: boolean;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {}

export interface ClienteListParams {
    skip?: number;
    limit?: number;
    search?: string;
    tipo_pessoa?: 'fisica' | 'juridica';
    ativo?: boolean;
}

export interface ClienteListResponse {
    items: Cliente[];
    total: number;
    skip: number;
    limit: number;
}

export const clientesService = {
    /**
     * Lista todos os clientes com filtros
     */
    async list(params?: ClienteListParams): Promise<ClienteListResponse> {
        const response = await apiClient.get(API_ENDPOINTS.clientes.list, {
            params,
        });

        // Backend retorna array direto, não { items, total }
        const data = response.data;

        // Se já é o formato correto, retorna
        if (data.items && data.total !== undefined) {
            return data;
        }

        // Se é array, adapta para o formato esperado
        if (Array.isArray(data)) {
            return {
                items: data,
                total: data.length,
                skip: params?.skip || 0,
                limit: params?.limit || 100,
            };
        }

        // Fallback
        return {
            items: [],
            total: 0,
            skip: 0,
            limit: 100,
        };
    },

    /**
     * Busca um cliente por ID
     */
    async getById(id: number): Promise<Cliente> {
        const response = await apiClient.get(API_ENDPOINTS.clientes.detail(id));
        return response.data;
    },

    /**
     * Cria um novo cliente
     */
    async create(data: ClienteCreate): Promise<Cliente> {
        const response = await apiClient.post(
            API_ENDPOINTS.clientes.create,
            data
        );
        return response.data;
    },

    /**
     * Atualiza um cliente existente
     */
    async update(id: number, data: ClienteUpdate): Promise<Cliente> {
        const response = await apiClient.put(
            API_ENDPOINTS.clientes.update(id),
            data
        );
        return response.data;
    },

    /**
     * Remove um cliente
     * @param id - ID do cliente
     * @param permanent - Se true, remove permanentemente. Se false, soft delete (marca como inativo)
     */
    async delete(id: number, permanent: boolean = false): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.clientes.delete(id), {
            params: { permanent },
        });
    },

    /**
     * Lista projetos de um cliente
     */
    async getProjetos(id: number): Promise<any[]> {
        const response = await apiClient.get(
            API_ENDPOINTS.clientes.projetos(id)
        );
        return response.data;
    },
};
