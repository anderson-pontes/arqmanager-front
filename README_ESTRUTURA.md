# ARQManager Frontend - Estrutura do Projeto

## 📁 Estrutura de Diretórios

```
src/
├── api/                      # Configuração e chamadas API
│   └── client.ts            # Cliente Axios configurado
│
├── components/              # Componentes React
│   ├── common/             # Componentes reutilizáveis
│   │   ├── DataTable.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── PageHeader.tsx
│   │   └── StatusBadge.tsx
│   ├── layout/             # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── ui/                 # Componentes UI (shadcn/ui)
│
├── config/                  # Configurações
│   ├── api.ts              # Endpoints da API
│   └── constants.ts        # Constantes da aplicação
│
├── data/                    # Dados mock para desenvolvimento
│   ├── mockClientes.ts
│   ├── mockColaboradores.ts
│   ├── mockDashboard.ts
│   ├── mockEscritorio.ts
│   ├── mockProjetos.ts
│   ├── mockPropostas.ts
│   ├── mockServicos.ts
│   ├── mockStatus.ts
│   └── index.ts
│
├── hooks/                   # Custom hooks
│   └── use-mobile.ts
│
├── lib/                     # Bibliotecas e utilitários
│   └── utils.ts
│
├── pages/                   # Páginas da aplicação
│   ├── auth/
│   │   └── Login.tsx
│   └── dashboard/
│       └── Dashboard.tsx
│
├── routes/                  # Configuração de rotas
│   ├── index.tsx
│   └── PrivateRoute.tsx
│
├── store/                   # Gerenciamento de estado (Zustand)
│   ├── authStore.ts
│   └── escritorioStore.ts
│
├── types/                   # TypeScript types
│   └── index.ts
│
├── utils/                   # Funções utilitárias
│   ├── date.ts
│   ├── formatters.ts
│   └── validators.ts
│
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
└── index.css               # Estilos globais
```

## 🚀 Tecnologias Utilizadas

-   **React 19** - Biblioteca UI
-   **TypeScript** - Tipagem estática
-   **Vite** - Build tool
-   **React Router** - Roteamento
-   **TanStack Query** - Cache e gerenciamento de estado servidor
-   **Axios** - Cliente HTTP
-   **Zustand** - Gerenciamento de estado global
-   **Tailwind CSS** - Estilização
-   **shadcn/ui** - Componentes UI
-   **React Hook Form** - Gerenciamento de formulários
-   **Zod** - Validação de schemas
-   **date-fns** - Manipulação de datas
-   **Lucide React** - Ícones

## 📦 Componentes Criados

### Layout

-   **Header** - Cabeçalho com busca, notificações e menu do usuário
-   **Sidebar** - Menu lateral de navegação
-   **Layout** - Layout principal com header e sidebar

### Comuns

-   **PageHeader** - Cabeçalho de página com título e ações
-   **DataTable** - Tabela de dados genérica
-   **StatusBadge** - Badge de status colorido
-   **LoadingSpinner** - Indicador de carregamento

### UI (shadcn/ui)

Mais de 40 componentes UI prontos para uso incluindo:

-   Button, Input, Select, Checkbox, etc.
-   Card, Dialog, Sheet, Drawer
-   Table, Tabs, Accordion
-   Avatar, Badge, Skeleton
-   E muito mais...

## 🎨 Páginas Implementadas

### Autenticação

-   **Login** - Página de login com validação

### Dashboard

-   **Dashboard** - Visão geral com:
    -   Estatísticas (projetos ativos, atrasados, receitas)
    -   Projetos em andamento
    -   Projetos atrasados
    -   Aniversariantes do mês
    -   Pagamentos pendentes

## 🔧 Utilitários

### Formatadores

-   `formatCurrency` - Formata valores monetários
-   `formatDate` - Formata datas
-   `formatCPF/CNPJ` - Formata documentos
-   `formatPhone` - Formata telefones
-   `formatFileSize` - Formata tamanho de arquivos

### Validadores

-   `isValidCPF` - Valida CPF
-   `isValidCNPJ` - Valida CNPJ
-   `isValidEmail` - Valida email
-   `isValidPhone` - Valida telefone

### Data

-   `formatDate` - Formatação de datas
-   `calculateBusinessDays` - Calcula dias úteis
-   `isOverdue` - Verifica se está atrasado

## 🗄️ Gerenciamento de Estado

### Zustand Stores

-   **authStore** - Autenticação e usuário logado
-   **escritorioStore** - Dados do escritório

## 📊 Dados Mock

Dados fictícios completos para desenvolvimento:

-   Escritório
-   Colaboradores (3)
-   Clientes (3)
-   Serviços (2)
-   Propostas (2)
-   Projetos (1 completo)
-   Status
-   Dashboard com estatísticas

## 🔐 Autenticação

-   Sistema de autenticação com JWT
-   Refresh token automático
-   Rotas protegidas
-   Persistência de sessão

## 📝 Próximos Passos

### Páginas a Criar

-   [ ] Clientes (lista, detalhe, formulário)
-   [ ] Projetos (lista, detalhe, formulário, calendário)
-   [ ] Propostas (lista, detalhe, formulário)
-   [ ] Financeiro
-   [ ] Colaboradores
-   [ ] Escritório
-   [ ] Configurações

### Funcionalidades

-   [ ] Integração com API real
-   [ ] Filtros e busca avançada
-   [ ] Paginação
-   [ ] Upload de arquivos
-   [ ] Geração de PDFs
-   [ ] Notificações em tempo real
-   [ ] Gráficos e relatórios

## 🎯 Como Usar

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar variáveis de ambiente:**

```bash
cp .env.example .env
```

3. **Iniciar servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Build para produção:**

```bash
npm run build
```

## 📚 Convenções

-   Componentes em PascalCase
-   Arquivos de tipos em camelCase
-   Hooks customizados com prefixo `use`
-   Stores com sufixo `Store`
-   Páginas organizadas por módulo
-   Componentes reutilizáveis em `common/`

## 🎨 Temas

O projeto usa Tailwind CSS com suporte a tema claro/escuro (configurável).

## 📖 Documentação Adicional

Consulte `DOCUMENTACAO_MIGRACAO.md` para detalhes completos do projeto e roadmap de implementação.
