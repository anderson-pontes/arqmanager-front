# ✅ Correção Aplicada - Erro do Axios

## 🐛 Problema Original:

```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/axios.js?v=a3c028c4'
does not provide an export named 'InternalAxiosRequestConfig' (at client.ts:1:29)
```

**Sintoma:** Front-end não carregava nem a tela de login

---

## 🔧 Correções Aplicadas:

### 1. ✅ Arquivo `src/api/client.ts` Corrigido

**Mudanças:**

-   ❌ Removido: `InternalAxiosRequestConfig` (tipo interno não exportado)
-   ✅ Adicionado: `any` para compatibilidade universal
-   ✅ Corrigido: Nomes de campos do backend (`access_token` em vez de `accessToken`)

**Código Corrigido:**

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Interceptor com tipo 'any' para compatibilidade
apiClient.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token com nomes corretos
const response = await axios.post(
    `${API_CONFIG.baseURL}/auth/refresh`,
    { refresh_token: refreshToken } // ✅ refresh_token (snake_case)
);

const { access_token } = response.data; // ✅ access_token (snake_case)
```

### 2. ✅ Cache do Vite Limpo

```bash
Remove-Item -Recurse -Force arqmanager-front\node_modules\.vite
```

### 3. ✅ Scripts Criados

-   `limpar-cache-vite.ps1` - Script PowerShell para limpar cache
-   `RESOLVER_ERRO_AXIOS.md` - Documentação do problema

---

## 🧪 Como Testar:

### Passo 1: Reiniciar Frontend

```bash
cd arqmanager-front
npm run dev
```

### Passo 2: Verificar se Carrega

```
http://localhost:5173
```

**Deve aparecer:** Tela de login normalmente

### Passo 3: Testar Integração

```
http://localhost:5173/test-integration
```

**Credenciais:**

-   Email: admin@arqmanager.com
-   Senha: admin123

---

## ✅ Checklist de Validação:

-   [x] Código corrigido em `src/api/client.ts`
-   [x] Cache do Vite limpo
-   [x] Tipos do TypeScript corretos
-   [x] Nomes de campos alinhados com backend
-   [ ] Frontend carrega normalmente (testar)
-   [ ] Login funciona (testar)
-   [ ] Listagem de clientes funciona (testar)

---

## 📝 Detalhes Técnicos:

### Por que `InternalAxiosRequestConfig` não funciona?

1. **Tipo Interno:** É um tipo interno do Axios, não exportado publicamente
2. **Versões:** Pode não existir em todas as versões do Axios
3. **Cache:** Vite pode cachear versões antigas dos tipos

### Solução: Usar `any`

```typescript
// ❌ Não funciona em todas as versões
(config: InternalAxiosRequestConfig) => {};

// ✅ Funciona universalmente
(config: any) => {};
```

### Backend usa snake_case

O FastAPI retorna campos em snake_case:

```json
{
    "access_token": "...",
    "refresh_token": "...",
    "token_type": "bearer"
}
```

Então devemos usar:

```typescript
const { access_token } = response.data; // ✅ Correto
const { accessToken } = response.data; // ❌ Errado
```

---

## 🚀 Próximos Passos:

1. **Testar:** Verificar se frontend carrega
2. **Validar:** Fazer login e testar listagem
3. **Continuar:** Avançar para Etapa 2 (CRUD de clientes)

---

## 💡 Dicas para Evitar Problemas:

### Sempre limpar cache ao mudar dependências:

```bash
.\limpar-cache-vite.ps1
```

### Usar tipos genéricos quando necessário:

```typescript
// Em vez de tipos específicos do Axios
(config: any) => {};
```

### Verificar nomes de campos do backend:

```typescript
// Backend FastAPI usa snake_case
{
    access_token, refresh_token;
}

// Frontend pode usar camelCase internamente
localStorage.setItem('accessToken', access_token);
```

---

## 📚 Arquivos Relacionados:

-   ✅ `src/api/client.ts` - Cliente Axios corrigido
-   ✅ `limpar-cache-vite.ps1` - Script de limpeza
-   ✅ `RESOLVER_ERRO_AXIOS.md` - Documentação
-   ✅ `CORRECAO_APLICADA.md` - Este arquivo

---

**Status:** ✅ Correção aplicada, aguardando teste  
**Data:** 2025-11-08  
**Tempo:** ~5 minutos
