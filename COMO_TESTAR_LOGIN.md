# 🔐 Como Testar o Login - Guia Passo a Passo

## ✅ Pré-requisitos

1. Servidor rodando: `npm run dev`
2. Navegador aberto em: http://localhost:5173
3. Console do navegador aberto (F12)

## 📝 Credenciais de Teste

O sistema aceita **QUALQUER** email e senha válidos:

### Opção 1 (Recomendada)

-   **Email**: `teste@email.com`
-   **Senha**: `123456`

### Opção 2

-   **Email**: `admin@arq.com`
-   **Senha**: `senha123`

### Opção 3

-   **Email**: `qualquer@email.com`
-   **Senha**: `abcdef` (mínimo 6 caracteres)

## 🎯 Passo a Passo

### 1. Abrir a Página

```
http://localhost:5173
```

Você deve ver a tela de login com:

-   Logo "ARQ"
-   Título "ARQManager"
-   Campos de email e senha
-   Botão "Entrar"

### 2. Preencher o Formulário

**Email:**

-   Digite um email válido (ex: `teste@email.com`)
-   Deve ter formato: `usuario@dominio.com`

**Senha:**

-   Digite uma senha com mínimo 6 caracteres (ex: `123456`)
-   Pode ser qualquer combinação

### 3. Clicar em "Entrar"

O que deve acontecer:

1. ✅ Botão muda para "Entrando..."
2. ✅ Aguarda 1 segundo (simulação)
3. ✅ Mostra toast verde: "Login realizado com sucesso!"
4. ✅ Redireciona para o Dashboard

### 4. Verificar Dashboard

Após login bem-sucedido, você deve ver:

-   ✅ Header com busca e menu do usuário
-   ✅ Sidebar com navegação
-   ✅ Cards de estatísticas
-   ✅ Projetos em andamento
-   ✅ Aniversariantes
-   ✅ Pagamentos pendentes

## ❌ Possíveis Erros

### Erro 1: "Email inválido"

**Causa**: Email sem formato correto
**Solução**: Use formato `usuario@dominio.com`

### Erro 2: "Senha deve ter no mínimo 6 caracteres"

**Causa**: Senha muito curta
**Solução**: Use pelo menos 6 caracteres

### Erro 3: Nada acontece ao clicar

**Causa**: JavaScript não carregou
**Solução**:

1. Abra o console (F12)
2. Veja se há erros
3. Recarregue a página (Ctrl+Shift+R)

### Erro 4: Tela em branco

**Causa**: Cache do Vite
**Solução**:

```powershell
.\limpar-cache.ps1
npm run dev
```

## 🔍 Debug

### Verificar no Console

Abra o console do navegador (F12) e procure por:

**Sucesso:**

```
✅ Sem erros
✅ Mensagem de sucesso
✅ Redirecionamento para /dashboard
```

**Erro:**

```
❌ Erros em vermelho
❌ Avisos em amarelo
```

### Verificar Network

Na aba Network (F12):

-   Não deve haver chamadas de API (estamos usando mock)
-   Deve haver carregamento de assets (JS, CSS)

### Verificar LocalStorage

No console, digite:

```javascript
localStorage.getItem('auth-storage');
```

Deve retornar algo como:

```json
{
  "state": {
    "user": {...},
    "isAuthenticated": true
  }
}
```

## 🎨 Aparência Esperada

### Tela de Login

```
┌─────────────────────────────────┐
│         [Logo ARQ]              │
│       ARQManager                │
│                                 │
│  Email: [____________]          │
│  Senha: [____________]          │
│  □ Lembrar-me                   │
│                                 │
│      [Entrar]                   │
│                                 │
│  Esqueceu sua senha?            │
└─────────────────────────────────┘
```

### Dashboard (Após Login)

```
┌─────────────────────────────────────────┐
│ [ARQ] ARQManager    [🔍] [🔔] [👤]     │
├──────┬──────────────────────────────────┤
│ 📊   │  Estatísticas                    │
│ 👥   │  [12] [3] [5] [R$85k] [R$120k] │
│ 🏗️   │                                  │
│ 📄   │  Projetos em Andamento           │
│ 💰   │  [Lista de projetos...]          │
│      │                                  │
└──────┴──────────────────────────────────┘
```

## ✅ Checklist de Teste

-   [ ] Servidor rodando
-   [ ] Página de login carregou
-   [ ] Campos de email e senha visíveis
-   [ ] Email válido digitado
-   [ ] Senha com 6+ caracteres digitada
-   [ ] Botão "Entrar" clicado
-   [ ] Toast de sucesso apareceu
-   [ ] Redirecionou para Dashboard
-   [ ] Dashboard carregou com dados
-   [ ] Menu do usuário funciona
-   [ ] Sidebar funciona

## 💡 Dicas

1. **Use Ctrl+Shift+R** para recarregar sem cache
2. **Abra o console** para ver erros
3. **Qualquer email válido funciona** (é mock!)
4. **Senha mínima**: 6 caracteres
5. **Não precisa ser cadastrado** (é mock!)

## 🆘 Ainda não funciona?

1. **Limpe o cache:**

```powershell
.\limpar-cache.ps1
```

2. **Reinstale dependências:**

```bash
npm install
```

3. **Reinicie o servidor:**

```bash
npm run dev
```

4. **Limpe o navegador:**
    - Ctrl+Shift+R
    - Ou F12 > Application > Clear Storage

---

**Tempo esperado**: 30 segundos  
**Dificuldade**: Muito fácil  
**Taxa de sucesso**: 99%
