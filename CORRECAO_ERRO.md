# 🔧 Correção de Erro - Tela em Branco

## ❌ Erro Encontrado

```
authStore.ts:3 Uncaught SyntaxError: The requested module '/src/types/index.ts'
does not provide an export named 'User'
```

## ✅ Solução

O erro é causado por cache do Vite. Siga os passos:

### 1. Parar o servidor

Pressione `Ctrl + C` no terminal

### 2. Limpar cache

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules\.vite

# Linux/Mac
rm -rf node_modules/.vite
```

### 3. Reiniciar servidor

```bash
npm run dev
```

### 4. Limpar cache do navegador

-   Pressione `Ctrl + Shift + R` (Windows/Linux)
-   Pressione `Cmd + Shift + R` (Mac)

## 🔍 Verificação

O tipo `User` está corretamente exportado em `src/types/index.ts`:

```typescript
export interface User {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    escritorioId: number;
    foto?: string;
}
```

## 🚀 Após Correção

1. Acesse http://localhost:5173
2. A tela de login deve aparecer
3. Faça login com:
    - Email: qualquer@email.com
    - Senha: 123456

## 💡 Dica

Se o erro persistir:

```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**Status**: ✅ Correção aplicada
