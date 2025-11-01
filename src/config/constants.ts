// Constantes da aplicação

export const APP_NAME = 'ARQManager';
export const APP_VERSION = '2.0.0';

// Paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Formatos de data
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Status de projetos
export const STATUS_PROJETO = {
    EM_ANDAMENTO: 'Em Andamento',
    PAUSADO: 'Pausado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
    ATRASADO: 'Atrasado',
} as const;

// Status de propostas
export const STATUS_PROPOSTA = {
    EM_ANALISE: 'Em Análise',
    APROVADA: 'Aprovada',
    REJEITADA: 'Rejeitada',
    AGUARDANDO_CLIENTE: 'Aguardando Cliente',
} as const;

// Tipos de pessoa
export const TIPO_PESSOA = {
    FISICA: 'Física',
    JURIDICA: 'Jurídica',
} as const;

// Formas de pagamento
export const FORMAS_PAGAMENTO = [
    'Dinheiro',
    'PIX',
    'Transferência',
    'Boleto',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Cheque',
] as const;

// Cores dos status
export const STATUS_COLORS = {
    'Em Análise': '#FFA500',
    Aprovada: '#28A745',
    Rejeitada: '#DC3545',
    'Aguardando Cliente': '#FFC107',
    'Em Andamento': '#007BFF',
    Pausado: '#6C757D',
    Concluído: '#28A745',
    Cancelado: '#DC3545',
    Atrasado: '#DC3545',
    Pendente: '#FFC107',
    Recebido: '#28A745',
} as const;

// Mensagens
export const MESSAGES = {
    success: {
        create: 'Registro criado com sucesso!',
        update: 'Registro atualizado com sucesso!',
        delete: 'Registro excluído com sucesso!',
        save: 'Salvo com sucesso!',
    },
    error: {
        generic: 'Ocorreu um erro. Tente novamente.',
        network: 'Erro de conexão. Verifique sua internet.',
        unauthorized: 'Você não tem permissão para esta ação.',
        notFound: 'Registro não encontrado.',
        validation: 'Verifique os campos do formulário.',
    },
    confirm: {
        delete: 'Tem certeza que deseja excluir este registro?',
        cancel: 'Tem certeza que deseja cancelar?',
    },
} as const;

// Timeout de sessão (em minutos)
export const SESSION_TIMEOUT = 30;

// Tamanho máximo de upload (em MB)
export const MAX_FILE_SIZE = 10;

// Tipos de arquivo permitidos
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
