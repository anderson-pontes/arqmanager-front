import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config/api';

export interface Colaborador {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    data_nascimento?: string;
    perfil: 'Admin' | 'Gerente' | 'Colaborador';
    tipo: 'Geral' | 'Terceirizado';
    ativo: boolean;
    foto?: string;
    ultimo_acesso?: string;
    tipo_pix?: string;
    chave_pix?: string;
    escritorios?: Array<{
        id: number;
        nome_fantasia: string;
        razao_social: string;
    }>;
    perfis?: ColaboradorPerfil[];
    created_at?: string;
    updated_at?: string;
}

export interface ColaboradorPerfil {
    id: number;
    colaborador_id: number;
    escritorio_id: number;
    perfil: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
}

export interface ColaboradorCreate {
    nome: string;
    email: string;
    cpf?: string;
    telefone?: string;
    data_nascimento?: string;
    perfil?: string; // Mantido para compatibilidade
    perfis?: string[]; // Múltiplos perfis
    tipo: 'Geral' | 'Terceirizado';
    senha: string;
    tipo_pix?: string;
    chave_pix?: string;
}

export interface ColaboradorUpdate {
    nome?: string;
    email?: string;
    telefone?: string;
    data_nascimento?: string;
    perfil?: 'Admin' | 'Gerente' | 'Colaborador';
    tipo?: 'Geral' | 'Terceirizado';
    ativo?: boolean;
    foto?: string;
    tipo_pix?: string;
    chave_pix?: string;
    senha?: string;
}

export interface ColaboradorListParams {
    skip?: number;
    limit?: number;
    ativo?: boolean;
    search?: string;
}

export interface ColaboradorListResponse {
    items: Colaborador[];
    total: number;
}

class ColaboradoresService {
    async list(params?: ColaboradorListParams): Promise<Colaborador[]> {
        const queryParams = new URLSearchParams();
        
        if (params?.skip !== undefined) {
            queryParams.append('skip', params.skip.toString());
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.ativo !== undefined) {
            queryParams.append('ativo', params.ativo.toString());
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }

        const queryString = queryParams.toString();
        const url = `${API_ENDPOINTS.colaboradores.list}${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiClient.get<Colaborador[]>(url);
        return response.data;
    }

    async getById(id: number): Promise<Colaborador> {
        const response = await apiClient.get<Colaborador>(
            API_ENDPOINTS.colaboradores.detail(id)
        );
        return response.data;
    }

    async create(data: ColaboradorCreate): Promise<Colaborador> {
        const response = await apiClient.post<Colaborador>(
            API_ENDPOINTS.colaboradores.create,
            data
        );
        return response.data;
    }

    async update(id: number, data: ColaboradorUpdate): Promise<Colaborador> {
        const response = await apiClient.put<Colaborador>(
            API_ENDPOINTS.colaboradores.update(id),
            data
        );
        return response.data;
    }

    async delete(id: number, permanent: boolean = false): Promise<void> {
        const url = new URL(API_ENDPOINTS.colaboradores.delete(id), apiClient.defaults.baseURL);
        url.searchParams.append('permanent', String(permanent));
        await apiClient.delete(url.pathname + url.search);
    }

    async count(): Promise<number> {
        // Remover barra final se existir
        const baseUrl = API_ENDPOINTS.colaboradores.list.replace(/\/$/, '');
        const response = await apiClient.get<{ total: number }>(
            `${baseUrl}/stats/count`
        );
        return response.data.total;
    }

    async getPerfis(id: number): Promise<ColaboradorPerfil[]> {
        const response = await apiClient.get<ColaboradorPerfil[]>(
            `${API_ENDPOINTS.colaboradores.detail(id)}/perfis`
        );
        return response.data;
    }

    async updatePerfis(id: number, escritorioId: number, perfis: string[]): Promise<ColaboradorPerfil[]> {
        const response = await apiClient.put<ColaboradorPerfil[]>(
            `${API_ENDPOINTS.colaboradores.detail(id)}/perfis`,
            {
                escritorio_id: escritorioId,
                perfis: perfis
            }
        );
        return response.data;
    }
}

export const colaboradoresService = new ColaboradoresService();

