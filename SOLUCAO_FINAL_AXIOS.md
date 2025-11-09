# ✅ Solução Final - Erro do Axios

## 🐛 Problema:

```
Uncaught SyntaxError: The requested module does not provide an export named 'AxiosRequestConfig'
```

## 🔧 Solução Definitiva:

### ❌ O que NÃO funciona:

```typescript
// Estes tipos não são exportados pelo Axios
import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios';
```

### ✅ O que FUNCIONA:

```typescript
// Importar APENAS o default export
import axios from 'axios';

// Usar 'any' para tipos
(config: any) => {};
(error: any) => {};
```

## 📝 Código Final (`src/api/client.ts`):

```typescript
import axios from 'axios'; // ✅ Apenas default import
import { API_CONFIG } from '@/config/api';

export const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de requisição
apiClient.interceptors.request.use(
    (config: any) => {
        // ✅ any
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        // ✅ any
        return Promise.reject(error);
    }
);

// Interceptor de resposta
apiClient.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        // ✅ any
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(
                    `${API_CONFIG.baseURL}/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token } = response.data;
                localStorage.setItem('accessToken', access_token);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
```

## 🧹 Limpar Cache:

```bash
# PowerShell
Remove-Item -Recurse -Force arqmanager-front\node_modules\.vite
Remove-Item -Recurse -Force arqmanager-front\node_modules\.vite-temp

# Ou usar o script
cd arqmanager-front
.\limpar-cache-vite.ps1
```

## 🚀 Reiniciar:

```bash
cd arqmanager-front
npm run dev
```

## ✅ Deve Funcionar Agora!

Acesse:

-   http://localhost:5173 (deve carregar a tela de login)
-   http://localhost:5173/test-integration (página de teste)

**Credenciais:** admin@arqmanager.com / admin123

---

## 💡 Por que isso aconteceu?

1. **Axios não exporta tipos nomeados** - Apenas o default export
2. **Vite cacheia imports** - Precisa limpar cache após mudanças
3. **TypeScript strict mode** - Requer tipos explícitos

## 🎯 Lição Aprendida:

**Sempre use apenas:**

```typescript
import axios from 'axios';
```

**E tipos genéricos:**

```typescript
(config: any) => {};
(error: any) => {};
```

---

**Status:** ✅ Corrigido definitivamente  
**Data:** 2025-11-08
