# 🛠️ Comandos Úteis - ARQManager Frontend

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar com porta específica
npm run dev -- --port 3000

# Iniciar e abrir no navegador
npm run dev -- --open
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Build e preview
npm run build && npm run preview
```

## 🧪 Testes e Qualidade

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Lint do código
npm run lint

# Formatar código
npx prettier --write "src/**/*.{ts,tsx}"
```

## 📦 Adicionar Componentes shadcn/ui

```bash
# Adicionar um componente específico
npx shadcn@latest add [component-name]

# Exemplos:
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add data-table
```

## 🔧 Utilitários

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Analisar bundle size
npm run build
npx vite-bundle-visualizer
```

## 🐛 Debug

```bash
# Verificar erros de TypeScript
npx tsc --noEmit --watch

# Verificar problemas de lint
npm run lint -- --fix

# Limpar cache do Vite
rm -rf node_modules/.vite
```

## 📊 Análise

```bash
# Analisar tamanho do bundle
npm run build
npx vite-bundle-visualizer

# Verificar performance
npm run build
npx lighthouse http://localhost:4173
```

## 🔄 Git

```bash
# Commit com mensagem
git add .
git commit -m "feat: adicionar página de clientes"

# Push
git push origin main

# Criar branch
git checkout -b feature/nome-da-feature
```

## 📝 Convenções de Commit

```bash
# Tipos de commit
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação
refactor: # Refatoração
test:     # Testes
chore:    # Manutenção

# Exemplos:
git commit -m "feat: adicionar página de clientes"
git commit -m "fix: corrigir validação de CPF"
git commit -m "docs: atualizar README"
```

## 🎨 Tailwind CSS

```bash
# Gerar arquivo de configuração
npx tailwindcss init -p

# Verificar classes não utilizadas
npx tailwindcss-unused-classes
```

## 📦 Dependências Úteis

```bash
# Adicionar biblioteca de datas
npm install date-fns

# Adicionar biblioteca de ícones
npm install lucide-react

# Adicionar biblioteca de gráficos
npm install recharts

# Adicionar biblioteca de tabelas
npm install @tanstack/react-table
```

## 🔐 Variáveis de Ambiente

```bash
# Desenvolvimento
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Produção
VITE_API_BASE_URL=https://api.arqmanager.com/api/v1

# Staging
VITE_API_BASE_URL=https://staging-api.arqmanager.com/api/v1
```

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Deploy para Vercel
npx vercel

# Deploy para Netlify
npx netlify deploy --prod

# Deploy para GitHub Pages
npm run build
npx gh-pages -d dist
```

## 📱 Mobile/PWA

```bash
# Adicionar suporte PWA
npm install vite-plugin-pwa -D

# Testar em dispositivo móvel
npm run dev -- --host
# Acessar via IP local: http://192.168.x.x:5173
```

## 🔍 Buscar no Código

```bash
# Buscar texto em arquivos
grep -r "texto" src/

# Buscar e substituir
find src/ -type f -name "*.tsx" -exec sed -i 's/antigo/novo/g' {} +
```

## 📊 Estatísticas do Projeto

```bash
# Contar linhas de código
npx cloc src/

# Listar arquivos por tamanho
du -sh src/* | sort -h

# Verificar dependências não utilizadas
npx depcheck
```

## 🎯 Atalhos do VS Code

```
Ctrl + P       # Buscar arquivo
Ctrl + Shift + P  # Command Palette
Ctrl + `       # Abrir terminal
Ctrl + B       # Toggle sidebar
F2             # Renomear símbolo
Alt + Shift + F   # Formatar documento
```

## 🔧 Configurações Recomendadas

### VS Code Extensions

-   ESLint
-   Prettier
-   Tailwind CSS IntelliSense
-   TypeScript Vue Plugin (Volar)
-   Auto Rename Tag
-   Path Intellisense

### VS Code Settings (settings.json)

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 📚 Recursos Úteis

-   [React Docs](https://react.dev)
-   [TypeScript Docs](https://www.typescriptlang.org/docs)
-   [Tailwind CSS Docs](https://tailwindcss.com/docs)
-   [shadcn/ui Docs](https://ui.shadcn.com)
-   [TanStack Query Docs](https://tanstack.com/query)
-   [React Router Docs](https://reactrouter.com)
-   [Zustand Docs](https://docs.pmnd.rs/zustand)

## 🎓 Tutoriais

```bash
# Criar novo componente
# 1. Criar arquivo em src/components/
# 2. Exportar componente
# 3. Importar onde necessário

# Criar nova página
# 1. Criar arquivo em src/pages/
# 2. Adicionar rota em src/routes/index.tsx
# 3. Adicionar link no Sidebar

# Criar novo hook
# 1. Criar arquivo em src/hooks/
# 2. Prefixar com "use"
# 3. Exportar hook

# Criar novo store
# 1. Criar arquivo em src/store/
# 2. Usar create() do Zustand
# 3. Exportar store
```

## 🐛 Problemas Comuns

### Erro: "Cannot find module"

```bash
npm install
# ou
rm -rf node_modules && npm install
```

### Erro: "Port already in use"

```bash
npx kill-port 5173
# ou
npm run dev -- --port 3000
```

### Erro: TypeScript

```bash
npx tsc --noEmit
# Verificar erros e corrigir
```

### Erro: ESLint

```bash
npm run lint -- --fix
```

---

**Dica**: Adicione estes comandos como scripts no package.json para facilitar o uso!
