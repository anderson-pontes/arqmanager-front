# 🏗️ ARQManager - Frontend

Sistema de gerenciamento para escritórios de arquitetura - Interface moderna em React + TypeScript

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Sobre o Projeto

O **ARQManager** é um sistema completo de gerenciamento para escritórios de arquitetura que controla:

-   👥 Gestão de clientes e colaboradores
-   📊 Orçamentos e propostas
-   🏗️ Projetos e cronogramas
-   💰 Controle financeiro
-   📁 Documentação e arquivos
-   📅 Reuniões e atas
-   🔔 Notificações e alertas

---

## 🚀 Início Rápido

### Pré-requisitos

-   Node.js 18+
-   npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone [url-do-repositorio]

# Entrar na pasta
cd arqmanager-front

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Iniciar desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

### Login de Teste

-   Email: qualquer@email.com
-   Senha: 123456 (mínimo 6 caracteres)

---

## 🛠️ Tecnologias

### Core

-   **React 19** - Biblioteca UI
-   **TypeScript 5.9** - Tipagem estática
-   **Vite 7.1** - Build tool ultrarrápido

### Roteamento & Estado

-   **React Router 7** - Roteamento
-   **Zustand 5** - Estado global
-   **TanStack Query 5** - Cache e estado servidor

### UI & Estilo

-   **Tailwind CSS 4** - Framework CSS
-   **shadcn/ui** - Componentes UI (40+)
-   **Radix UI** - Primitivos acessíveis
-   **Lucide React** - Ícones

### Formulários & Validação

-   **React Hook Form 7** - Gerenciamento de formulários
-   **Zod 4** - Validação de schemas

### Utilitários

-   **Axios 1** - Cliente HTTP
-   **date-fns 4** - Manipulação de datas
-   **Sonner** - Notificações toast

---

## 📁 Estrutura do Projeto

```
src/
├── api/              # Configuração API
├── components/       # Componentes React
│   ├── common/      # Reutilizáveis
│   ├── layout/      # Layout
│   └── ui/          # shadcn/ui
├── config/          # Configurações
├── data/            # Dados mock
├── hooks/           # Custom hooks
├── pages/           # Páginas
├── routes/          # Rotas
├── store/           # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utilitários
```

---

## 🎨 Componentes Disponíveis

### Layout (3)

-   Header, Sidebar, Layout

### Comuns (7)

-   PageHeader, DataTable, StatusBadge
-   LoadingSpinner, ConfirmDialog
-   SearchFilter, StatCard

### UI (40+)

Todos os componentes do shadcn/ui incluindo:

-   Button, Input, Select, Checkbox
-   Card, Dialog, Sheet, Drawer
-   Table, Tabs, Form, Badge
-   E muito mais...

---

## 📊 Status do Projeto

### ✅ Completo (Fase 1)

-   Infraestrutura e setup
-   Sistema de autenticação
-   Layout responsivo
-   Dashboard com estatísticas
-   40+ componentes UI
-   Dados mock completos
-   Utilitários e formatadores

### 🚧 Em Desenvolvimento (Fase 2)

-   Páginas CRUD (Clientes, Projetos, Propostas)
-   Integração com backend
-   Filtros e busca avançada

### 📅 Planejado (Fase 3+)

-   Área do cliente
-   Relatórios e gráficos
-   Notificações em tempo real
-   Geração de PDFs

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor dev
npm run dev:host         # Dev com acesso externo

# Build
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade
npm run lint             # Verificar código
npm run lint:fix         # Corrigir problemas
npm run type-check       # Verificar tipos
npm run format           # Formatar código
```

---

## 📚 Documentação

-   **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guia de início rápido
-   **[README_ESTRUTURA.md](./README_ESTRUTURA.md)** - Estrutura detalhada
-   **[SETUP_COMPLETO.md](./SETUP_COMPLETO.md)** - Setup completo
-   **[COMANDOS_UTEIS.md](./COMANDOS_UTEIS.md)** - Comandos úteis
-   **[DICAS_DESENVOLVIMENTO.md](./DICAS_DESENVOLVIMENTO.md)** - Boas práticas
-   **[CHECKLIST.md](./CHECKLIST.md)** - Checklist de desenvolvimento
-   **[RESUMO_EXECUTIVO.md](./RESUMO_EXECUTIVO.md)** - Resumo executivo

---

## 🎯 Roadmap

### Fase 1 - Setup e Frontend Base ✅

-   [x] Configuração do projeto
-   [x] Componentes base
-   [x] Layout responsivo
-   [x] Autenticação
-   [x] Dashboard

### Fase 2 - Páginas CRUD (Atual)

-   [ ] Clientes (lista, detalhe, formulário)
-   [ ] Projetos (lista, detalhe)
-   [ ] Propostas (lista, detalhe)
-   [ ] Filtros e busca

### Fase 3 - Backend

-   [ ] Setup FastAPI
-   [ ] Autenticação real
-   [ ] Endpoints CRUD

### Fase 4 - Integração

-   [ ] Conectar frontend/backend
-   [ ] TanStack Query hooks
-   [ ] Tratamento de erros

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

-   `feat:` Nova funcionalidade
-   `fix:` Correção de bug
-   `docs:` Documentação
-   `style:` Formatação
-   `refactor:` Refatoração
-   `test:` Testes
-   `chore:` Manutenção

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👥 Autores

-   **Equipe ARQManager** - _Desenvolvimento inicial_

---

## 🙏 Agradecimentos

-   [React](https://react.dev)
-   [Vite](https://vitejs.dev)
-   [Tailwind CSS](https://tailwindcss.com)
-   [shadcn/ui](https://ui.shadcn.com)
-   [TanStack Query](https://tanstack.com/query)

---

**Versão**: 2.0.0  
**Status**: 🚀 Em desenvolvimento ativo  
**Última atualização**: Novembro 2024
