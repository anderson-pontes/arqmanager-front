// Tipos principais da aplicação

export interface Endereco {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
}

export interface Escritorio {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    documento: string;
    email: string;
    telefone: string;
    endereco: string;
    cor: string;
    diasUteis: boolean;
    prazoArquivaProposta: number;
    observacaoPropostaPadrao: string;
    observacaoContratoPadrao: string;
}

export interface Colaborador {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    dataNascimento: string;
    perfil: string;
    ativo: boolean;
    foto?: string;
    ultimoAcesso?: string;
}

export interface Cliente {
    id: number;
    nome: string;
    razaoSocial?: string;
    email: string;
    identificacao: string;
    tipoPessoa: 'Física' | 'Jurídica';
    telefone: string;
    whatsapp?: string;
    dataNascimento?: string;
    endereco: Endereco;
    inscricaoEstadual?: string;
    inscricaoMunicipal?: string;
    indicadoPor?: string;
    ativo: boolean;
    dataCadastro?: string;
}

export interface Status {
    id: number;
    nome: string;
    cor: string;
    tipo: 'proposta' | 'projeto';
}

export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    ativo: boolean;
    etapas: ServicoEtapa[];
}

export interface ServicoEtapa {
    id: number;
    nome: string;
    descricao: string;
    ordem: number;
}

export interface Proposta {
    id: number;
    numero: string;
    ano: number;
    cliente: Cliente;
    servico: Servico;
    status: string;
    identificacao: string;
    descricao: string;
    valorProposta: number;
    valorParcelaAprazo: number;
    dataProposta: string;
    observacao?: string;
    etapas: PropostaEtapa[];
}

export interface PropostaEtapa {
    id?: number;
    etapa: ServicoEtapa;
    prazo: number;
    dataPrevista: string;
    descricao?: string;
}

export interface Projeto {
    id: number;
    numero: string;
    ano: number;
    cliente: Cliente;
    servico: Servico;
    proposta?: Proposta;
    status: string;
    descricao: string;
    metragem?: number;
    valorContrato: number;
    saldoContrato: number;
    dataInicio: string;
    dataPrevisaoFim: string;
    dataFim?: string;
    observacao?: string;
    equipe: Colaborador[];
    etapas: ProjetoEtapa[];
    pagamentos: ProjetoPagamento[];
    documentos: ProjetoDocumento[];
    reunioes: Reuniao[];
}

export interface ProjetoEtapa {
    id: number;
    etapa: string;
    prazo: number;
    dataPrevista: string;
    dataConclusao?: string;
    status: string;
}

export interface ProjetoPagamento {
    id: number;
    descricao: string;
    valor: number;
    valorRecebido: number;
    valorAcrescido?: number;
    valorDesconto?: number;
    valorResultante?: number;
    dataPrevisao: string;
    dataEfetivacao?: string;
    formaPagamento: string;
    status: string;
}

export interface ProjetoDocumento {
    id: number;
    nome: string;
    tipo: string;
    dataUpload: string;
    tamanho: string;
    caminho?: string;
}

export interface Reuniao {
    id: number;
    data: string;
    dataCliente?: string;
    deAcordo: boolean;
    observacao: string;
}

export interface DashboardEstatisticas {
    projetosAtivos: number;
    projetosAtrasados: number;
    propostasPendentes: number;
    receitaMes: number;
    receitaPrevista: number;
}

export interface ProjetoAtrasado {
    id: number;
    numero: string;
    cliente: string;
    diasAtraso: number;
    etapaAtrasada: string;
}

export interface Aniversariante {
    nome: string;
    data: string;
    tipo: 'cliente' | 'colaborador';
}

export interface PagamentoPendente {
    projeto: string;
    cliente: string;
    valor: number;
    vencimento: string;
    diasAtraso: number;
}

export interface Dashboard {
    estatisticas: DashboardEstatisticas;
    projetosAndamento: Projeto[];
    projetosAtrasados: ProjetoAtrasado[];
    aniversariantes: Aniversariante[];
    pagamentosPendentes: PagamentoPendente[];
}

// Tipos de formulário
export interface LoginForm {
    email: string;
    senha: string;
    lembrar?: boolean;
}

export type ClienteForm = Omit<Cliente, 'id' | 'dataCadastro'>;

export type ProjetoForm = Omit<
    Projeto,
    | 'id'
    | 'cliente'
    | 'servico'
    | 'equipe'
    | 'etapas'
    | 'pagamentos'
    | 'documentos'
    | 'reunioes'
> & {
    clienteId: number;
    servicoId: number;
    equipeIds: number[];
};

export type PropostaForm = Omit<
    Proposta,
    'id' | 'cliente' | 'servico' | 'etapas'
> & {
    clienteId: number;
    servicoId: number;
};

// Tipos de resposta da API
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

// Tipos de autenticação
export interface User {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    escritorioId: number;
    foto?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
