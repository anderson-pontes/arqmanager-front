# 🔗 Integração Front-end → Backend - ARQManager

## 🎯 Visão Geral

Este documento descreve a integração completa entre o front-end React e o backend FastAPI do ARQManager.

---

## 📊 Status Atual

### ✅ Etapa 1: Configuração Inicial - CONCLUÍDA

-   Autenticação (login, logout, refresh token)
-   Listagem de clientes
-   Hooks customizados
-   Página de teste funcional

### 🔜 Próximas Etapas

-   Etapa 2: CRUD Completo de Clientes
-   Etapa 3: Projetos
-   Etapa 4: Propostas
-   Etapa 5: Financeiro
-   Etapa 6: Dashboard
-   Etapa 7: Colaboradores e Escritório

---

## 🚀 Quick Start

### 1. Iniciar Backend

```bash
cd arqmanager-backend
python -m uvicorn app.main:app --reload
```

### 2. Iniciar Frontend

```bash
cd arqmanager-front
npm run dev
```

### 3. Testar Integração

```
http://localhost:5173/test-integration
```

**Credenciais:**

-   Email: admin@arqmanager.com
-   Senha: admin123

---

## 📁 Estrutura de Arquivos

```
arqmanager-front/
├── src/
│   ├── api/
│   │   ├── client.ts              # Cliente Axios configurado
│   │   └── services/
│   │       ├── index.ts           # Exportações
│   │       ├── auth.service.ts    # Serviço de autenticação
│   │       └── clientes.service.ts # Serviço de clientes
│   ├── hooks/
│   │   ├── useAuth.ts             # Hook de autenticação
│   │   └── useClientes.ts         # Hook de clientes
│   ├── pages/
│   │   └── TestIntegration.tsx    # Página de teste
│   └── config/
│       └── api.ts                 # Configurações da API
├── .env                           # Variáveis de ambiente
├── ETAPA_1_TESTE.md              # Instruções de teste
├── ETAPA_1_RESUMO.md             # Resumo da etapa 1
└── README_INTEGRACAO.md          # Este arquivo
```

---

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=ARQManager
VITE_APP_VERSION=2.0.0
```

### Cliente Axios (src/api/client.ts)

```typescript
- baseURL: http://localhost:8000/api/v1
- timeout: 30000ms
- Interceptor de request: adiciona token JWT
- Interceptor de response: trata 401 e refresh automático
```

---

## 📚 Serviços Disponíveis

### Auth Service

```typescript
authService.login(email, password);
authService.logout();
authService.refreshToken(token);
authService.saveTokens(access, refresh);
authService.clearTokens();
authService.isAuthenticated();
```

### Clientes Service

```typescript
clientesService.list(params);
clientesService.getById(id);
clientesService.create(data);
clientesService.update(id, data);
clientesService.delete(id);
clientesService.getProjetos(id);
```

---

## 🎣 Hooks Customizados

### useAuth

```typescript
const { login, logout, isAuthenticated, getUser, loading, error } = useAuth();
```

### useClientes

```typescript
const {
    clientes,
    total,
    loading,
    error,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
} = useClientes(params);
```

---

## 🧪 Como Testar

### Teste Manual

1. Acesse http://localhost:5173/test-integration
2. Faça login com admin@arqmanager.com / admin123
3. Clique em "Buscar Clientes"
4. Verifique se 135 clientes aparecem
5. Faça logout

### Teste Automatizado (Node)

```bash
cd arqmanager-front
node test-api.js
```

### Teste no Console do Navegador

```javascript
// Verificar token
localStorage.getItem('accessToken');

// Verificar usuário
JSON.parse(localStorage.getItem('user'));

// Limpar dados
localStorage.clear();
```

---

## 🔐 Autenticação

### Fluxo de Login

```
1. Usuário envia email/senha
2. Backend valida e retorna tokens JWT
3. Frontend salva tokens no localStorage
4. Interceptor adiciona token em todas as requisições
5. Se token expirar (401), tenta refresh automático
6. Se refresh falhar, redireciona para login
```

### Estrutura do Token

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "user": {
        "id": 1,
        "nome": "Admin",
        "email": "admin@arqmanager.com",
        "escritorio_id": 1
    }
}
```

---

## 📡 Endpoints Integrados

### Autenticação

-   `POST /api/v1/auth/login` - Login
-   `POST /api/v1/auth/logout` - Logout
-   `POST /api/v1/auth/refresh` - Refresh token

### Clientes

-   `GET /api/v1/clientes` - Listar
-   `GET /api/v1/clientes/{id}` - Buscar
-   `POST /api/v1/clientes` - Criar
-   `PUT /api/v1/clientes/{id}` - Atualizar
-   `DELETE /api/v1/clientes/{id}` - Excluir

---

## ❌ Tratamento de Erros

### Erros de Rede

```typescript
try {
    await clientesService.list();
} catch (error) {
    if (error.response) {
        // Erro da API (4xx, 5xx)
        console.error(error.response.data.detail);
    } else if (error.request) {
        // Sem resposta do servidor
        console.error('Backend não está respondendo');
    } else {
        // Erro na configuração da requisição
        console.error(error.message);
    }
}
```

### Erros Comuns

| Erro                      | Causa                    | Solução                |
| ------------------------- | ------------------------ | ---------------------- |
| Network Error             | Backend não está rodando | Iniciar backend        |
| CORS Error                | CORS mal configurado     | Verificar CORS_ORIGINS |
| 401 Unauthorized          | Token inválido           | Fazer login novamente  |
| 404 Not Found             | Endpoint não existe      | Verificar URL          |
| 500 Internal Server Error | Erro no backend          | Ver logs do backend    |

---

## 🎨 Componentes UI

### Shadcn/ui Components Usados

-   Button
-   Input
-   Card
-   Toast (Sonner)

### Exemplo de Uso

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
    <CardHeader>
        <CardTitle>Título</CardTitle>
    </CardHeader>
    <CardContent>
        <Input placeholder="Email" />
        <Button>Enviar</Button>
    </CardContent>
</Card>;
```

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Componente │ ← useAuth / useClientes
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │ ← authService / clientesService
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Axios Client│ ← Interceptors
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │ ← FastAPI
└─────────────┘
```

---

## 📝 Padrões de Código

### Nomenclatura

-   Services: `nomeService` (camelCase)
-   Hooks: `useNome` (camelCase com prefixo use)
-   Componentes: `NomeComponente` (PascalCase)
-   Tipos: `NomeTipo` (PascalCase)

### Estrutura de Service

```typescript
export const nomeService = {
    async list(params) {
        /* ... */
    },
    async getById(id) {
        /* ... */
    },
    async create(data) {
        /* ... */
    },
    async update(id, data) {
        /* ... */
    },
    async delete(id) {
        /* ... */
    },
};
```

### Estrutura de Hook

```typescript
export const useNome = (params) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        /* ... */
    };

    useEffect(() => {
        fetchData();
    }, [params]);

    return { data, loading, error, fetchData };
};
```

---

## 🚀 Próximos Passos

### Etapa 2: CRUD Completo de Clientes

1. Criar formulário de cliente com validação (Zod)
2. Implementar criação de cliente
3. Implementar edição de cliente
4. Implementar exclusão com confirmação
5. Adicionar busca e filtros avançados
6. Adicionar paginação
7. Adicionar feedback visual (toasts)

### Etapas Futuras

-   Etapa 3: Projetos (CRUD + etapas + documentos)
-   Etapa 4: Propostas (CRUD + conversão para projeto)
-   Etapa 5: Financeiro (dashboard + pagamentos)
-   Etapa 6: Dashboard (estatísticas + gráficos)
-   Etapa 7: Colaboradores e Escritório

---

## 📚 Documentação Adicional

-   [ETAPA_1_TESTE.md](ETAPA_1_TESTE.md) - Instruções detalhadas de teste
-   [ETAPA_1_RESUMO.md](ETAPA_1_RESUMO.md) - Resumo técnico da etapa 1
-   [../PLANO_INTEGRACAO_STATUS.md](../PLANO_INTEGRACAO_STATUS.md) - Status geral do projeto
-   [../COMANDOS_RAPIDOS.md](../COMANDOS_RAPIDOS.md) - Comandos úteis

---

## 🆘 Suporte

### Problemas Comuns

1. **Backend não inicia:** Verificar .env e banco de dados
2. **Frontend não carrega:** Executar `npm install`
3. **Erro de CORS:** Verificar CORS_ORIGINS no backend
4. **Token inválido:** Limpar localStorage e fazer login

### Debug

```javascript
// Console do navegador (F12)
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));

// Ver requisições
// Aba Network → Filtrar por "api"
```

---

## ✅ Checklist de Validação

-   [x] Backend rodando em http://localhost:8000
-   [x] Frontend rodando em http://localhost:5173
-   [x] Login funciona
-   [x] Token é salvo no localStorage
-   [x] Listagem de clientes retorna 135 itens
-   [x] Logout limpa tokens
-   [x] Interceptor adiciona token automaticamente
-   [x] Refresh token funciona em caso de 401
-   [x] Erros são tratados e exibidos
-   [ ] CRUD completo de clientes (próxima etapa)

---

**Última atualização:** 2025-11-08  
**Versão:** 1.0.0  
**Status:** ✅ Etapa 1 concluída
