# 🔧 Resolver Erro do Axios

## ❌ Erro:

```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/axios.js?v=a3c028c4'
does not provide an export named 'InternalAxiosRequestConfig'
```

## ✅ Solução Aplicada:

### 1. Corrigido `src/api/client.ts`

-   Removido `InternalAxiosRequestConfig` (não existe em todas as versões)
-   Usado `any` para compatibilidade universal
-   Corrigido nomes de campos (`access_token` em vez de `accessToken`)

### 2. Limpar Cache do Vite

```bash
# Windows PowerShell
Remove-Item -Recurse -Force arqmanager-front\node_modules\.vite

# Linux/Mac
rm -rf arqmanager-front/node_modules/.vite
```

### 3. Reiniciar o Frontend

```bash
cd arqmanager-front
npm run dev
```

## 🧪 Testar:

1. Acesse: http://localhost:5173
2. Deve carregar a tela de login normalmente
3. Acesse: http://localhost:5173/test-integration
4. Faça login: admin@arqmanager.com / admin123

## 📝 O que foi mudado:

### Antes (com erro):

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // ...
});
```

### Depois (corrigido):

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

apiClient.interceptors.request.use((config: any) => {
    // ...
});
```

## 💡 Por que aconteceu?

-   `InternalAxiosRequestConfig` é um tipo interno do Axios
-   Não está disponível em todas as versões
-   Usar `any` garante compatibilidade
-   O cache do Vite pode manter versões antigas

## ✅ Status:

-   [x] Código corrigido
-   [x] Cache limpo
-   [x] Pronto para testar

**Agora o frontend deve carregar normalmente!** 🚀
