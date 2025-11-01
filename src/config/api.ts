// Configuração da API
export const API_CONFIG = {
    baseURL:
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: 30000,
};

export const API_ENDPOINTS = {
    // Autenticação
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        resetPassword: '/auth/reset-password',
    },
    // Clientes
    clientes: {
        list: '/clientes',
        detail: (id: number) => `/clientes/${id}`,
        create: '/clientes',
        update: (id: number) => `/clientes/${id}`,
        delete: (id: number) => `/clientes/${id}`,
        projetos: (id: number) => `/clientes/${id}/projetos`,
    },
    // Projetos
    projetos: {
        list: '/projetos',
        detail: (id: number) => `/projetos/${id}`,
        create: '/projetos',
        update: (id: number) => `/projetos/${id}`,
        delete: (id: number) => `/projetos/${id}`,
        etapas: (id: number) => `/projetos/${id}/etapas`,
        microservicos: (id: number) => `/projetos/${id}/microservicos`,
        pagamentos: (id: number) => `/projetos/${id}/pagamentos`,
        documentos: (id: number) => `/projetos/${id}/documentos`,
        reunioes: (id: number) => `/projetos/${id}/reunioes`,
        estatisticas: (id: number) => `/projetos/${id}/estatisticas`,
        status: (id: number) => `/projetos/${id}/status`,
    },
    // Propostas
    propostas: {
        list: '/propostas',
        detail: (id: number) => `/propostas/${id}`,
        create: '/propostas',
        update: (id: number) => `/propostas/${id}`,
        delete: (id: number) => `/propostas/${id}`,
        converterProjeto: (id: number) => `/propostas/${id}/converter-projeto`,
    },
    // Colaboradores
    colaboradores: {
        list: '/colaboradores',
        detail: (id: number) => `/colaboradores/${id}`,
        create: '/colaboradores',
        update: (id: number) => `/colaboradores/${id}`,
    },
    // Financeiro
    financeiro: {
        projeto: (id: number) => `/financeiro/projetos/${id}`,
        dashboard: '/financeiro/dashboard',
        pagamentos: '/financeiro/pagamentos',
        pagamento: (id: number) => `/financeiro/pagamentos/${id}`,
    },
    // Escritório
    escritorio: {
        get: '/escritorio',
        update: '/escritorio',
        servicos: '/escritorio/servicos',
        configuracoes: '/escritorio/configuracoes',
    },
    // Dashboard
    dashboard: {
        estatisticas: '/dashboard/estatisticas',
        projetosAndamento: '/dashboard/projetos-andamento',
        projetosAtrasados: '/dashboard/projetos-atrasados',
        aniversariantes: '/dashboard/aniversariantes',
    },
};
