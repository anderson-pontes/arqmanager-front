import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config/api';
import type { Escritorio, User } from '@/types';

export interface CreateEscritorioRequest {
    nome_fantasia: string;
    razao_social: string;
    documento: string;
    email: string;
    telefone?: string;
    endereco?: string;
    cor?: string;
}

export interface CreateAdminRequest {
    nome: string;
    email: string;
    senha: string;
    cpf?: string;
    telefone?: string;
}

export interface CreateEscritorioWithAdminResponse {
    escritorio: Escritorio;
    admin: {
        id: number;
        nome: string;
        email: string;
    };
}

export const adminService = {
    // Escritórios (endpoints em /escritorios mas requerem admin do sistema)
    async listEscritorios(params?: { skip?: number; limit?: number; ativo?: boolean }) {
        const response = await apiClient.get<Escritorio[]>(API_ENDPOINTS.admin.escritorios.list, { params });
        return response.data;
    },

    async getEscritorio(id: number) {
        const response = await apiClient.get<Escritorio>(API_ENDPOINTS.admin.escritorios.detail(id));
        return response.data;
    },

    async createEscritorioWithAdmin(escritorioData: CreateEscritorioRequest, adminData: CreateAdminRequest) {
        const response = await apiClient.post<CreateEscritorioWithAdminResponse>(
            API_ENDPOINTS.admin.escritorios.create,
            { escritorio_data: escritorioData, admin_data: adminData }
        );
        return response.data;
    },

    async updateEscritorio(id: number, data: Partial<CreateEscritorioRequest>) {
        const response = await apiClient.put<Escritorio>(API_ENDPOINTS.admin.escritorios.update(id), data);
        return response.data;
    },

    async deleteEscritorio(id: number) {
        await apiClient.delete(API_ENDPOINTS.admin.escritorios.delete(id));
    },

    // Administradores do Sistema
    async listSystemAdmins(params?: { skip?: number; limit?: number }) {
        const response = await apiClient.get<User[]>(API_ENDPOINTS.admin.systemAdmins.list, { params });
        return response.data;
    },

    async createSystemAdmin(data: CreateAdminRequest) {
        // Remover campos undefined antes de enviar
        const cleanData: any = {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
        };
        
        if (data.cpf && data.cpf.trim()) {
            cleanData.cpf = data.cpf.trim();
        }
        
        if (data.telefone && data.telefone.trim()) {
            cleanData.telefone = data.telefone.trim();
        }
        
        const response = await apiClient.post<User>(API_ENDPOINTS.admin.systemAdmins.create, cleanData);
        return response.data;
    },

    // Administradores de Escritório
    async listEscritorioAdmins(escritorioId: number, params?: { skip?: number; limit?: number }) {
        const response = await apiClient.get<User[]>(
            API_ENDPOINTS.admin.escritorioAdmins.list(escritorioId),
            { params }
        );
        return response.data;
    },

    async createEscritorioAdmin(escritorioId: number, data: CreateAdminRequest) {
        // Remover campos undefined antes de enviar
        const cleanData: any = {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
        };
        
        if (data.cpf && data.cpf.trim()) {
            cleanData.cpf = data.cpf.trim();
        }
        
        if (data.telefone && data.telefone.trim()) {
            cleanData.telefone = data.telefone.trim();
        }
        
        const response = await apiClient.post<User>(
            API_ENDPOINTS.admin.escritorioAdmins.create(escritorioId),
            cleanData
        );
        return response.data;
    },
};

