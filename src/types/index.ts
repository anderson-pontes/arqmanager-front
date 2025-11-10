// Tipos principais da aplicação

// Tipos Financeiros - Tipos específicos
export type TipoReceita =
    | 'Novo Projeto'
    | 'Confirmação de Projeto'
    | 'Nova Receita'
    | 'Confirmar Receita';

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
    tipo?: 'Geral' | 'Terceirizado';
    ativo: boolean;
    foto?: string;
    ultimoAcesso?: string;
    socio?: string;
    tipoPix?: string;
    chavePix?: string;
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
    projeto: {
        id: number;
        numero: string;
        cliente: string;
    };
    data: string;
    dataCliente?: string;
    deAcordo: boolean;
    observacao: string;
    participantes: string[];
    local?: string;
    status: 'Pendente' | 'Confirmada' | 'Cancelada';
    manifestacoes: ReuniaoManifestacao[];
    ata?: string;
}

export interface ReuniaoManifestacao {
    id: number;
    reuniaoId: number;
    autor: string;
    data: string;
    tipo: 'Cliente' | 'Escritório';
    mensagem: string;
    anexos?: string[];
}

export interface ProjetoMicroservico {
    id: number;
    projetoId: number;
    descricao: string;
    metragem?: number;
    valor: number;
    dataInicio?: string;
    dataFim?: string;
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
    observacao?: string;
}

export interface ProjetoTimeline {
    id: number;
    projetoId: number;
    tipo: 'Etapa' | 'Reunião' | 'Documento' | 'Pagamento' | 'Observação';
    titulo: string;
    descricao: string;
    data: string;
    responsavel?: string;
    status?: string;
    icone?: string;
    cor?: string;
}

export interface RRT {
    id: number;
    projetoId: number;
    numero: string;
    dataEmissao: string;
    dataValidade?: string;
    valor: number;
    responsavelTecnico: string;
    registro: string;
    tipo: string;
    observacao?: string;
    arquivo?: string;
    status: 'Pendente' | 'Emitida' | 'Vencida';
}

export interface TermoEntrega {
    id: number;
    projetoId: number;
    dataEntrega: string;
    responsavelEntrega: string;
    responsavelRecebimento: string;
    itensEntregues: string[];
    observacao?: string;
    assinaturaEscritorio?: string;
    assinaturaCliente?: string;
    status: 'Pendente' | 'Assinado' | 'Cancelado';
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
    escritorioId?: number; // Opcional até selecionar o escritório
    escritorioAtual?: Escritorio; // Escritório selecionado
    escritorios: UserEscritorio[]; // Lista de escritórios do usuário
    foto?: string;
    isSystemAdmin?: boolean;  // NOVO: Admin do sistema
}

export interface UserEscritorio {
    id: number;
    escritorio: Escritorio;
    perfil: string; // Perfil específico neste escritório
    ativo: boolean;
    dataVinculo: string;
}

export interface EscritorioContextInfo {
    id: number;
    nome_fantasia: string;
    razao_social: string;
    cor: string;
    perfil?: string | null;
}

export interface SetContextRequest {
    escritorio_id?: number | null;  // null para área administrativa
    perfil?: string | null;  // null para área administrativa
}

export interface SetContextResponse {
    access_token: string;
    escritorio_id?: number | null;
    perfil?: string | null;
    is_admin_mode: boolean;  // True quando está em modo administrativo
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
    requires_escritorio_selection: boolean;
    is_system_admin: boolean;  // NOVO
    available_escritorios: EscritorioContextInfo[];  // NOVO
}

// Tipos Financeiros
export interface ContaBancaria {
    id: number;
    nome: string;
    banco: string;
    agencia: string;
    conta: string;
    tipo:
        | 'Corrente'
        | 'Poupança'
        | 'Investimento'
        | 'Caixa'
        | 'Salário'
        | 'Outros';
    saldoInicial: number;
    saldoAtual: number;
    ativo: boolean;
    cor?: string;
    responsavel?: string;
    dataInicio?: string;
    dataEncerramento?: string;
    tipoPix?: string;
    chavePix?: string;
}

export interface CategoriaFinanceira {
    id: number;
    nome: string;
    tipo: 'Receita' | 'Despesa';
    cor: string;
    icone?: string;
    ativo: boolean;
}

export interface Movimentacao {
    id: number;
    tipo: 'Receita' | 'Despesa' | 'Transferência';
    tipoReceita?: TipoReceita; // Tipo específico para receitas
    descricao: string;
    valor: number;
    data: string;
    dataPagamento?: string;
    categoria: CategoriaFinanceira;
    conta: ContaBancaria;
    contaDestino?: ContaBancaria; // Para transferências
    status: 'Pendente' | 'Pago' | 'Cancelado';
    formaPagamento: string;
    observacao?: string;
    anexo?: string;
    recorrente: boolean;
    projeto?: {
        id: number;
        numero: string;
        cliente: string;
    };
}

export interface ResumoFinanceiro {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    receitasPendentes: number;
    despesasPendentes: number;
    contasBancarias: {
        conta: string;
        saldo: number;
    }[];
}

// Tipos de Calendário
export interface Feriado {
    id: number;
    nome: string;
    data: string;
    tipo: 'Nacional' | 'Estadual' | 'Municipal' | 'Ponto Facultativo';
    recorrente: boolean;
    descricao?: string;
    cor?: string;
}

export interface Evento {
    id: number;
    titulo: string;
    descricao?: string;
    dataInicio: string;
    dataFim: string;
    horaInicio?: string;
    horaFim?: string;
    tipo: 'Reunião' | 'Prazo' | 'Entrega' | 'Outro';
    local?: string;
    participantes?: string[];
    projeto?: {
        id: number;
        numero: string;
        cliente: string;
    };
    cor?: string;
}
