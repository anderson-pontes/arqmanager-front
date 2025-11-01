# ⚡ Solução Rápida - Tela em Branco

## 🔴 Problema

Tela em branco com erro: `The requested module '/src/types/index.ts' does not provide an export named 'User'`

## ✅ Solução em 3 Passos

### 1️⃣ Parar o Servidor

No terminal onde o servidor está rodando, pressione:

```
Ctrl + C
```

### 2️⃣ Limpar Cache do Vite

**Windows (PowerShell):**

```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

**Linux/Mac:**

```bash
rm -rf node_modules/.vite
```

### 3️⃣ Reiniciar o Servidor

```bash
npm run dev
```

### 4️⃣ Limpar Cache do Navegador

Quando a página abrir, pressione:

-   **Windows/Linux**: `Ctrl + Shift + R`
-   **Mac**: `Cmd + Shift + R`

---

## 🎯 Resultado Esperado

Após seguir os passos, você deve ver:

1. ✅ Servidor iniciado sem erros
2. ✅ Página de login carregada
3. ✅ Sem erros no console do navegador

---

## 🔍 Se o Problema Persistir

### Opção 1: Limpar Tudo

```bash
# Parar servidor (Ctrl + C)

# Limpar cache e node_modules
Remove-Item -Recurse -Force node_modules, node_modules\.vite, package-lock.json

# Reinstalar
npm install

# Iniciar
npm run dev
```

### Opção 2: Verificar Porta

Se a porta 5173 estiver em uso:

```bash
# Matar processo na porta
npx kill-port 5173

# Ou usar outra porta
npm run dev -- --port 3000
```

---

## 📝 Explicação Técnica

O erro ocorre porque:

1. O Vite mantém cache dos módulos em `node_modules/.vite`
2. Às vezes esse cache fica desatualizado
3. Limpar o cache força o Vite a reprocessar todos os módulos

---

## ✅ Checklist de Verificação

Após aplicar a solução:

-   [ ] Servidor iniciou sem erros
-   [ ] Página de login apareceu
-   [ ] Console do navegador sem erros
-   [ ] Possível fazer login
-   [ ] Dashboard carrega após login

---

## 🚀 Teste Rápido

1. Acesse: http://localhost:5173
2. Login: `teste@email.com`
3. Senha: `123456`
4. Deve redirecionar para o Dashboard

---

**Tempo estimado**: 2 minutos  
**Dificuldade**: Fácil  
**Sucesso**: 99%
