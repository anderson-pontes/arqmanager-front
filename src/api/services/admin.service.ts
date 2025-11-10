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
        const response = await apiClient.get<any[]>(API_ENDPOINTS.admin.escritorios.list, { params });
        // Converter snake_case para camelCase
        return response.data.map((e: any) => ({
            id: e.id,
            nomeFantasia: e.nome_fantasia || e.nomeFantasia,
            razaoSocial: e.razao_social || e.razaoSocial,
            documento: e.documento,
            email: e.email,
            telefone: e.telefone || null,
            endereco: e.endereco || null,
            cor: e.cor || '#6366f1',
            ativo: e.ativo !== undefined ? e.ativo : true,
            created_at: e.created_at,
            updated_at: e.updated_at,
        }));
    },

    async getEscritorio(id: number) {
        const response = await apiClient.get<any>(API_ENDPOINTS.admin.escritorios.detail(id));
        const e = response.data;
        // Converter snake_case para camelCase
        return {
            id: e.id,
            nomeFantasia: e.nome_fantasia || e.nomeFantasia,
            razaoSocial: e.razao_social || e.razaoSocial,
            documento: e.documento,
            email: e.email,
            telefone: e.telefone || null,
            endereco: e.endereco || null,
            cor: e.cor || '#6366f1',
            ativo: e.ativo !== undefined ? e.ativo : true,
            created_at: e.created_at,
            updated_at: e.updated_at,
        };
    },

    async createEscritorioWithAdmin(escritorioData: CreateEscritorioRequest, adminData: CreateAdminRequest) {
        const response = await apiClient.post<any>(
            API_ENDPOINTS.admin.escritorios.create,
            { escritorio_data: escritorioData, admin_data: adminData }
        );
        const data = response.data;
        // Converter snake_case para camelCase
        return {
            escritorio: {
                id: data.escritorio.id,
                nomeFantasia: data.escritorio.nome_fantasia || data.escritorio.nomeFantasia,
                razaoSocial: data.escritorio.razao_social || data.escritorio.razaoSocial,
                documento: data.escritorio.documento,
                email: data.escritorio.email,
                telefone: data.escritorio.telefone || null,
                endereco: data.escritorio.endereco || null,
                cor: data.escritorio.cor || '#6366f1',
                ativo: data.escritorio.ativo !== undefined ? data.escritorio.ativo : true,
                created_at: data.escritorio.created_at,
                updated_at: data.escritorio.updated_at,
            },
            admin: data.admin,
        };
    },

    async updateEscritorio(id: number, data: Partial<CreateEscritorioRequest>) {
        const response = await apiClient.put<any>(API_ENDPOINTS.admin.escritorios.update(id), data);
        const e = response.data;
        // Converter snake_case para camelCase
        return {
            id: e.id,
            nomeFantasia: e.nome_fantasia || e.nomeFantasia,
            razaoSocial: e.razao_social || e.razaoSocial,
            documento: e.documento,
            email: e.email,
            telefone: e.telefone || null,
            endereco: e.endereco || null,
            cor: e.cor || '#6366f1',
            ativo: e.ativo !== undefined ? e.ativo : true,
            created_at: e.created_at,
            updated_at: e.updated_at,
        };
    },

    async toggleEscritorioActive(id: number) {
        const response = await apiClient.patch<any>(API_ENDPOINTS.admin.escritorios.toggleActive(id));
        const e = response.data;
        // Converter snake_case para camelCase
        return {
            id: e.id,
            nomeFantasia: e.nome_fantasia || e.nomeFantasia,
            razaoSocial: e.razao_social || e.razaoSocial,
            documento: e.documento,
            email: e.email,
            telefone: e.telefone || null,
            endereco: e.endereco || null,
            cor: e.cor || '#6366f1',
            ativo: e.ativo !== undefined ? e.ativo : true,
            created_at: e.created_at,
            updated_at: e.updated_at,
        };
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

    async updateSystemAdmin(userId: number, data: Partial<CreateAdminRequest> & { senha?: string }) {
        const cleanData: any = {};
        
        if (data.nome) cleanData.nome = data.nome;
        if (data.email) cleanData.email = data.email;
        if (data.senha) cleanData.senha = data.senha;
        if (data.cpf !== undefined) {
            cleanData.cpf = data.cpf && data.cpf.trim() ? data.cpf.trim() : null;
        }
        if (data.telefone !== undefined) {
            cleanData.telefone = data.telefone && data.telefone.trim() ? data.telefone.trim() : null;
        }
        
        const response = await apiClient.put<User>(API_ENDPOINTS.admin.systemAdmins.update(userId), cleanData);
        return response.data;
    },

    async toggleSystemAdminActive(userId: number) {
        const response = await apiClient.patch<User>(API_ENDPOINTS.admin.systemAdmins.toggleActive(userId));
        return response.data;
    },

    async deleteSystemAdmin(userId: number) {
        await apiClient.delete(API_ENDPOINTS.admin.systemAdmins.delete(userId));
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

    async updateEscritorioAdmin(escritorioId: number, userId: number, data: Partial<CreateAdminRequest> & { senha?: string }) {
        const cleanData: any = {};
        
        if (data.nome) cleanData.nome = data.nome;
        if (data.email) cleanData.email = data.email;
        if (data.senha) cleanData.senha = data.senha;
        if (data.cpf !== undefined) {
            cleanData.cpf = data.cpf && data.cpf.trim() ? data.cpf.trim() : null;
        }
        if (data.telefone !== undefined) {
            cleanData.telefone = data.telefone && data.telefone.trim() ? data.telefone.trim() : null;
        }
        
        const response = await apiClient.put<User>(
            API_ENDPOINTS.admin.escritorioAdmins.update(escritorioId, userId),
            cleanData
        );
        return response.data;
    },

    async toggleEscritorioAdminActive(escritorioId: number, userId: number) {
        const response = await apiClient.patch<User>(
            API_ENDPOINTS.admin.escritorioAdmins.toggleActive(escritorioId, userId)
        );
        return response.data;
    },

    async deleteEscritorioAdmin(escritorioId: number, userId: number) {
        await apiClient.delete(API_ENDPOINTS.admin.escritorioAdmins.delete(escritorioId, userId));
    },
};

