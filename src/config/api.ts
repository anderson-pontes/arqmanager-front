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
        setContext: '/auth/set-context',
        availableEscritorios: '/auth/available-escritorios',
    },
    // Clientes
    clientes: {
        list: '/clientes/', // ✅ Com barra final
        detail: (id: number) => `/clientes/${id}`,
        create: '/clientes/', // ✅ Com barra final
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
        list: '/colaboradores/',
        detail: (id: number) => `/colaboradores/${id}`,
        create: '/colaboradores/',
        update: (id: number) => `/colaboradores/${id}`,
        delete: (id: number) => `/colaboradores/${id}`,
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
    // Serviços
    servicos: {
        list: '/servicos',
        detail: (id: number) => `/servicos/${id}`,
        create: '/servicos',
        update: (id: number) => `/servicos/${id}`,
        delete: (id: number) => `/servicos/${id}`,
        count: '/servicos/stats/count',
        etapas: {
            list: (servicoId: number) => `/servicos/${servicoId}/etapas`,
            create: (servicoId: number) => `/servicos/${servicoId}/etapas`,
            update: (servicoId: number, etapaId: number) => `/servicos/${servicoId}/etapas/${etapaId}`,
            delete: (servicoId: number, etapaId: number) => `/servicos/${servicoId}/etapas/${etapaId}`,
            tarefas: {
                list: (servicoId: number, etapaId: number) => `/servicos/${servicoId}/etapas/${etapaId}/tarefas`,
                create: (servicoId: number, etapaId: number) => `/servicos/${servicoId}/etapas/${etapaId}/tarefas`,
                update: (servicoId: number, etapaId: number, tarefaId: number) => `/servicos/${servicoId}/etapas/${etapaId}/tarefas/${tarefaId}`,
                delete: (servicoId: number, etapaId: number, tarefaId: number) => `/servicos/${servicoId}/etapas/${etapaId}/tarefas/${tarefaId}`,
            },
        },
    },
    // Tarefas (endpoints diretos)
    tarefas: {
        list: '/tarefas',
        detail: (id: number) => `/tarefas/${id}`,
        create: '/tarefas',
        update: (id: number) => `/tarefas/${id}`,
        delete: (id: number) => `/tarefas/${id}`,
        count: '/tarefas/stats/count',
    },
    // Administração (apenas admin do sistema)
    admin: {
        escritorios: {
            list: '/escritorios',
            detail: (id: number) => `/escritorios/${id}`,
            create: '/escritorios',
            update: (id: number) => `/escritorios/${id}`,
            toggleActive: (id: number) => `/escritorios/${id}/toggle-active`,
            delete: (id: number) => `/escritorios/${id}`,
        },
        systemAdmins: {
            list: '/admin/system-admins',
            create: '/admin/system-admin',
            update: (userId: number) => `/admin/system-admin/${userId}`,
            toggleActive: (userId: number) => `/admin/system-admin/${userId}/toggle-active`,
            delete: (userId: number) => `/admin/system-admin/${userId}`,
        },
        escritorioAdmins: {
            list: (escritorioId: number) => `/admin/escritorio-admins/${escritorioId}`,
            create: (escritorioId: number) => `/admin/escritorio-admin/${escritorioId}`,
            update: (escritorioId: number, userId: number) => `/admin/escritorio-admin/${escritorioId}/${userId}`,
            toggleActive: (escritorioId: number, userId: number) => `/admin/escritorio-admin/${escritorioId}/${userId}/toggle-active`,
            delete: (escritorioId: number, userId: number) => `/admin/escritorio-admin/${escritorioId}/${userId}`,
            available: '/admin/available-escritorio-admins',
            link: (escritorioId: number, userId: number) => `/admin/escritorio-admin/${escritorioId}/link/${userId}`,
        },
    },
    // Dashboard
    dashboard: {
        estatisticas: '/dashboard/estatisticas',
        projetosAndamento: '/dashboard/projetos-andamento',
        projetosAtrasados: '/dashboard/projetos-atrasados',
        aniversariantes: '/dashboard/aniversariantes',
    },
};
