# 🧪 Etapa 1: Configuração Inicial - TESTE

## ✅ O que foi criado:

### 1. Serviços de API (`src/api/services/`)

-   ✅ `auth.service.ts` - Autenticação (login, logout, refresh token)
-   ✅ `clientes.service.ts` - CRUD de clientes
-   ✅ `index.ts` - Exportação centralizada

### 2. Hooks Customizados (`src/hooks/`)

-   ✅ `useAuth.ts` - Hook para autenticação
-   ✅ `useClientes.ts` - Hook para gerenciar clientes

### 3. Página de Teste

-   ✅ `src/pages/TestIntegration.tsx` - Interface de teste completa

### 4. Configurações

-   ✅ CORS já configurado no backend
-   ✅ Axios client com interceptors
-   ✅ Variáveis de ambiente (.env)

---

## 🚀 Como Testar:

### Passo 1: Iniciar o Backend

```bash
cd arqmanager-backend
python -m uvicorn app.main:app --reload
```

Verifique se está rodando em: http://localhost:8000

### Passo 2: Iniciar o Frontend

```bash
cd arqmanager-front
npm run dev
```

Verifique se está rodando em: http://localhost:5173

### Passo 3: Adicionar Rota de Teste

Adicione esta linha no arquivo `src/App.tsx` ou no seu arquivo de rotas:

```tsx
import TestIntegration from '@/pages/TestIntegration';

// Adicione na lista de rotas:
<Route path="/test-integration" element={<TestIntegration />} />;
```

### Passo 4: Acessar Página de Teste

Abra no navegador: http://localhost:5173/test-integration

---

## 🧪 Testes a Realizar:

### Teste 1: Autenticação ✅

1. Preencha os campos:
    - Email: `admin@arqmanager.com`
    - Senha: `admin123`
2. Clique em "Login"
3. Verifique se aparece "✅ Autenticado!"
4. Verifique se os dados do usuário aparecem

**Resultado esperado:**

-   Login bem-sucedido
-   Token salvo no localStorage
-   Dados do usuário exibidos

### Teste 2: Listagem de Clientes ✅

1. Após fazer login, clique em "Buscar Clientes"
2. Verifique se os 135 clientes migrados aparecem
3. Role a lista para ver todos os clientes

**Resultado esperado:**

-   "✅ 135 clientes encontrados"
-   Lista com nome, email e tipo de cada cliente

### Teste 3: Logout ✅

1. Clique em "Logout"
2. Verifique se volta para tela de login
3. Verifique se o localStorage foi limpo

**Resultado esperado:**

-   Tokens removidos
-   Volta para estado não autenticado

---

## 🔍 Verificações Técnicas:

### No Console do Navegador (F12):

```javascript
// Verificar token salvo
localStorage.getItem('accessToken');

// Verificar dados do usuário
localStorage.getItem('user');

// Verificar requisições
// Aba Network → Filtrar por "api"
```

### Endpoints Testados:

-   ✅ `POST /api/v1/auth/login` - Login
-   ✅ `POST /api/v1/auth/logout` - Logout
-   ✅ `GET /api/v1/clientes` - Listar clientes

---

## ❌ Possíveis Erros e Soluções:

### Erro: "Network Error"

**Causa:** Backend não está rodando
**Solução:** Inicie o backend com `uvicorn app.main:app --reload`

### Erro: "CORS policy"

**Causa:** CORS não configurado corretamente
**Solução:** Verifique se `http://localhost:5173` está em `CORS_ORIGINS` no backend

### Erro: "401 Unauthorized"

**Causa:** Token inválido ou expirado
**Solução:** Faça logout e login novamente

### Erro: "Invalid credentials"

**Causa:** Email ou senha incorretos
**Solução:** Use `admin@arqmanager.com` / `admin123`

---

## 📊 Checklist de Validação:

-   [ ] Backend rodando em http://localhost:8000
-   [ ] Frontend rodando em http://localhost:5173
-   [ ] Login funciona com credenciais corretas
-   [ ] Token é salvo no localStorage
-   [ ] Dados do usuário são exibidos
-   [ ] Listagem de clientes retorna 135 itens
-   [ ] Logout limpa tokens e redireciona
-   [ ] Interceptor adiciona token automaticamente
-   [ ] Erros são tratados e exibidos

---

## 🎯 Próximos Passos:

Após validar esta etapa, podemos avançar para:

**Etapa 2: CRUD Completo de Clientes**

-   Criar novo cliente
-   Editar cliente existente
-   Excluir cliente
-   Busca e filtros avançados

---

## 💡 Dicas:

1. **Abra o DevTools (F12)** para ver as requisições HTTP
2. **Aba Network** mostra todas as chamadas à API
3. **Aba Console** mostra erros JavaScript
4. **Aba Application → Local Storage** mostra tokens salvos
5. Use **Postman** ou **Thunder Client** para testar endpoints diretamente

---

## 📝 Notas Técnicas:

### Estrutura de Token JWT:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
}
```

### Interceptor de Requisição:

-   Adiciona automaticamente `Authorization: Bearer <token>`
-   Tenta refresh automático em caso de 401
-   Redireciona para login se refresh falhar

### Estrutura de Cliente:

```typescript
{
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf_cnpj?: string;
  tipo_pessoa: 'fisica' | 'juridica';
  ativo: boolean;
  escritorio_id: number;
}
```

---

**Status:** ✅ Pronto para teste
**Tempo estimado:** 15-30 minutos
**Complexidade:** Baixa
