import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config/api';
import type { Servico, Etapa, Tarefa } from '@/types';

// Tipos de criação e atualização
export interface ServicoCreate {
    nome: string;
    descricao?: string;
    descricao_contrato?: string;
    valor_base?: number;
    unidade?: string;
    codigo_plano_contas?: string;
    ativo?: boolean;
    etapas?: EtapaCreate[];
}

export interface ServicoUpdate extends Partial<ServicoCreate> {}

export interface EtapaCreate {
    nome: string;
    descricao?: string;
    ordem: number;
    obrigatoria?: boolean;
}

export interface EtapaUpdate extends Partial<EtapaCreate> {}

export interface TarefaCreate {
    nome: string;
    ordem: number;
    cor?: string;
    tem_prazo?: boolean;
    precisa_detalhamento?: boolean;
}

export interface TarefaUpdate extends Partial<TarefaCreate> {}

export interface ServicoListParams {
    skip?: number;
    limit?: number;
    ativo?: boolean;
    search?: string;
}

export interface TarefaListParams {
    etapa_id?: number;
    skip?: number;
    limit?: number;
    search?: string;
}

export const servicoService = {
    /**
     * Lista todos os serviços
     */
    async list(params?: ServicoListParams): Promise<Servico[]> {
        const response = await apiClient.get(API_ENDPOINTS.servicos.list, {
            params,
        });
        return response.data;
    },

    /**
     * Busca um serviço por ID
     */
    async getById(id: number): Promise<Servico> {
        const response = await apiClient.get(API_ENDPOINTS.servicos.detail(id));
        return response.data;
    },

    /**
     * Cria um novo serviço
     */
    async create(data: ServicoCreate): Promise<Servico> {
        const response = await apiClient.post(API_ENDPOINTS.servicos.create, data);
        return response.data;
    },

    /**
     * Atualiza um serviço
     */
    async update(id: number, data: ServicoUpdate): Promise<Servico> {
        const response = await apiClient.put(API_ENDPOINTS.servicos.update(id), data);
        return response.data;
    },

    /**
     * Deleta um serviço
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.servicos.delete(id));
    },

    /**
     * Conta serviços
     */
    async count(ativo?: boolean): Promise<number> {
        const response = await apiClient.get(API_ENDPOINTS.servicos.count, {
            params: { ativo },
        });
        return response.data.total;
    },
};

export const etapaService = {
    /**
     * Lista todas as etapas de um serviço
     */
    async listByServico(servicoId: number): Promise<Etapa[]> {
        const response = await apiClient.get(
            API_ENDPOINTS.servicos.etapas.list(servicoId)
        );
        return response.data;
    },

    /**
     * Cria uma nova etapa para um serviço
     */
    async create(servicoId: number, data: EtapaCreate): Promise<Etapa> {
        const response = await apiClient.post(
            API_ENDPOINTS.servicos.etapas.create(servicoId),
            data
        );
        return response.data;
    },

    /**
     * Atualiza uma etapa
     */
    async update(
        servicoId: number,
        etapaId: number,
        data: EtapaUpdate
    ): Promise<Etapa> {
        const response = await apiClient.put(
            API_ENDPOINTS.servicos.etapas.update(servicoId, etapaId),
            data
        );
        return response.data;
    },

    /**
     * Deleta uma etapa
     */
    async delete(servicoId: number, etapaId: number): Promise<void> {
        await apiClient.delete(
            API_ENDPOINTS.servicos.etapas.delete(servicoId, etapaId)
        );
    },
};

export const tarefaService = {
    /**
     * Lista todas as tarefas (com filtros opcionais)
     */
    async list(params?: TarefaListParams): Promise<Tarefa[]> {
        const response = await apiClient.get(API_ENDPOINTS.tarefas.list, {
            params,
        });
        return response.data;
    },

    /**
     * Lista tarefas de uma etapa específica
     */
    async listByEtapa(servicoId: number, etapaId: number): Promise<Tarefa[]> {
        const response = await apiClient.get(
            API_ENDPOINTS.servicos.etapas.tarefas.list(servicoId, etapaId)
        );
        return response.data;
    },

    /**
     * Busca uma tarefa por ID
     */
    async getById(id: number): Promise<Tarefa> {
        const response = await apiClient.get(API_ENDPOINTS.tarefas.detail(id));
        return response.data;
    },

    /**
     * Cria uma nova tarefa (via endpoint direto)
     */
    async create(etapaId: number, data: TarefaCreate): Promise<Tarefa> {
        const response = await apiClient.post(API_ENDPOINTS.tarefas.create, data, {
            params: { etapa_id: etapaId },
        });
        return response.data;
    },

    /**
     * Cria uma nova tarefa para uma etapa específica
     */
    async createByEtapa(
        servicoId: number,
        etapaId: number,
        data: TarefaCreate
    ): Promise<Tarefa> {
        const response = await apiClient.post(
            API_ENDPOINTS.servicos.etapas.tarefas.create(servicoId, etapaId),
            data
        );
        return response.data;
    },

    /**
     * Atualiza uma tarefa
     */
    async update(id: number, data: TarefaUpdate): Promise<Tarefa> {
        const response = await apiClient.put(API_ENDPOINTS.tarefas.update(id), data);
        return response.data;
    },

    /**
     * Atualiza uma tarefa de uma etapa específica
     */
    async updateByEtapa(
        servicoId: number,
        etapaId: number,
        tarefaId: number,
        data: TarefaUpdate
    ): Promise<Tarefa> {
        const response = await apiClient.put(
            API_ENDPOINTS.servicos.etapas.tarefas.update(servicoId, etapaId, tarefaId),
            data
        );
        return response.data;
    },

    /**
     * Deleta uma tarefa
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.tarefas.delete(id));
    },

    /**
     * Deleta uma tarefa de uma etapa específica
     */
    async deleteByEtapa(
        servicoId: number,
        etapaId: number,
        tarefaId: number
    ): Promise<void> {
        await apiClient.delete(
            API_ENDPOINTS.servicos.etapas.tarefas.delete(servicoId, etapaId, tarefaId)
        );
    },

    /**
     * Conta tarefas
     */
    async count(etapaId?: number): Promise<number> {
        const response = await apiClient.get(API_ENDPOINTS.tarefas.count, {
            params: { etapa_id: etapaId },
        });
        return response.data.total;
    },
};

