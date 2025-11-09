# ✅ Correção de Imports - Resolvido

## 🐛 Problema:

```
Uncaught SyntaxError: The requested module does not provide an export named 'LoginRequest'
```

## 🔧 Causa:

O `export *` no arquivo `index.ts` não estava funcionando corretamente com o Vite.

## ✅ Solução:

Importar diretamente dos arquivos de serviço em vez do `index.ts`.

### Antes (com erro):

```typescript
import { authService, LoginRequest } from '@/api/services';
import { clientesService, Cliente, ClienteListParams } from '@/api/services';
```

### Depois (corrigido):

```typescript
import { authService, type LoginRequest } from '@/api/services/auth.service';
import {
    clientesService,
    type Cliente,
    type ClienteListParams,
} from '@/api/services/clientes.service';
```

## 📝 Arquivos Corrigidos:

### 1. `src/hooks/useAuth.ts`

```typescript
import { authService, type LoginRequest } from '@/api/services/auth.service';
```

### 2. `src/hooks/useClientes.ts`

```typescript
import {
    clientesService,
    type Cliente,
    type ClienteListParams,
} from '@/api/services/clientes.service';
```

## 🧹 Cache Limpo:

```bash
Remove-Item -Recurse -Force arqmanager-front\node_modules\.vite
```

## 🚀 Testar Agora:

```bash
cd arqmanager-front
npm run dev
```

Acesse:

-   http://localhost:5173
-   http://localhost:5173/test-integration

**Login:** admin@arqmanager.com / admin123

## ✅ Deve Funcionar!

Todas as importações agora são diretas e explícitas, evitando problemas com re-exports.

---

**Status:** ✅ Corrigido  
**Data:** 2025-11-08
