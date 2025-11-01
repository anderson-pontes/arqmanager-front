# 🚀 Início Rápido - ARQManager Frontend

## ⚡ Setup em 3 Passos

### 1️⃣ Instalar Dependências

```bash
cd arqmanager-front
npm install
```

### 2️⃣ Configurar Ambiente

```bash
cp .env.example .env
```

### 3️⃣ Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🔐 Login de Teste

-   **Email**: qualquer@email.com
-   **Senha**: 123456 (mínimo 6 caracteres)

O sistema está usando dados mock, então qualquer credencial válida funcionará!

---

## 📁 Estrutura Rápida

```
src/
├── components/     # Componentes React
│   ├── common/    # Reutilizáveis
│   ├── layout/    # Layout (Header, Sidebar)
│   └── ui/        # shadcn/ui (40+ componentes)
├── pages/         # Páginas
│   ├── auth/      # Login
│   └── dashboard/ # Dashboard
├── data/          # Dados mock
├── store/         # Zustand stores
├── types/         # TypeScript types
└── utils/         # Utilitários
```

---

## 🎯 O que Está Pronto

✅ **Autenticação** - Login funcional com mock  
✅ **Dashboard** - Com estatísticas e cards  
✅ **Layout** - Header + Sidebar responsivo  
✅ **Componentes** - 40+ componentes UI prontos  
✅ **Dados Mock** - Dados completos para desenvolvimento  
✅ **Utilitários** - Formatadores e validadores

---

## 📝 Próximos Passos

1. Explorar o Dashboard
2. Ver os dados mock em `src/data/`
3. Criar páginas de Clientes, Projetos e Propostas
4. Integrar com backend (quando estiver pronto)

---

## 📚 Documentação Completa

-   **README_ESTRUTURA.md** - Estrutura detalhada do projeto
-   **SETUP_COMPLETO.md** - Guia completo de setup
-   **COMANDOS_UTEIS.md** - Comandos úteis
-   **DICAS_DESENVOLVIMENTO.md** - Boas práticas
-   **CHECKLIST.md** - Checklist de desenvolvimento
-   **RESUMO_EXECUTIVO.md** - Resumo executivo

---

## 🛠️ Comandos Principais

```bash
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm run preview          # Preview do build
npm run lint             # Verificar código
npm run type-check       # Verificar tipos
```

---

## 🎨 Componentes Disponíveis

### Layout

-   Header, Sidebar, Layout

### Comuns

-   PageHeader, DataTable, StatusBadge
-   LoadingSpinner, ConfirmDialog
-   SearchFilter, StatCard

### UI (shadcn/ui)

-   Button, Input, Select, Checkbox
-   Card, Dialog, Sheet, Drawer
-   Table, Tabs, Form, Badge
-   E muito mais... (40+ componentes)

---

## 💡 Dicas Rápidas

### Criar Nova Página

1. Criar arquivo em `src/pages/`
2. Adicionar rota em `src/routes/index.tsx`
3. Adicionar link no Sidebar

### Usar Dados Mock

```tsx
import { mockClientes } from '@/data';

function MinhaPage() {
  return <div>{mockClientes.map(...)}</div>;
}
```

### Formatar Dados

```tsx
import { formatCurrency, formatDate } from '@/utils/formatters';

formatCurrency(1000); // R$ 1.000,00
formatDate('2024-01-01'); // 01/01/2024
```

### Validar Dados

```tsx
import { isValidCPF, isValidEmail } from '@/utils/validators';

isValidCPF('123.456.789-00'); // true/false
isValidEmail('email@test.com'); // true/false
```

---

## 🐛 Problemas Comuns

### Porta em uso

```bash
npx kill-port 5173
# ou
npm run dev -- --port 3000
```

### Erro de módulos

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro TypeScript

```bash
npm run type-check
```

---

## 📞 Precisa de Ajuda?

1. Consulte a documentação completa
2. Verifique os exemplos em `src/pages/`
3. Veja os componentes em `src/components/`
4. Explore os dados mock em `src/data/`

---

## 🎉 Pronto!

Você está pronto para começar a desenvolver!

**Próximo passo**: Criar a página de Clientes seguindo o padrão do Dashboard.

---

**Versão**: 1.0  
**Status**: ✅ Pronto para desenvolvimento  
**Última atualização**: Novembro 2024
