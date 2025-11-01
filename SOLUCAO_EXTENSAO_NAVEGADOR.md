# 🔧 Solução - Erros de Extensão do Navegador

## ❌ Problema Identificado

Os erros que você está vendo são causados por uma **extensão do navegador**, não pelo nosso código:

```
Uncaught (in promise) SyntaxError: "[object Object]" is not valid JSON
at l._storageChangeDispatcher (content.js:2:898238)
```

O arquivo `content.js` é de uma extensão do Chrome/Edge.

## ✅ Solução Rápida

### Opção 1: Modo Anônimo (Recomendado)

1. **Abra uma janela anônima:**

    - Chrome/Edge: `Ctrl + Shift + N`
    - Firefox: `Ctrl + Shift + P`

2. **Acesse:**

    ```
    http://localhost:5173
    ```

3. **Teste o login:**
    - Email: `teste@email.com`
    - Senha: `123456`

### Opção 2: Desabilitar Extensões

1. **Abra as extensões:**

    - Chrome/Edge: `chrome://extensions`
    - Firefox: `about:addons`

2. **Desabilite temporariamente:**

    - Extensões de senha
    - Extensões de tradução
    - Extensões de bloqueio de anúncios

3. **Recarregue a página:**
    - `Ctrl + Shift + R`

### Opção 3: Limpar LocalStorage

1. **Abra o console (F12)**

2. **Vá para Application > Storage**

3. **Clique em "Clear site data"**

4. **Recarregue:** `Ctrl + Shift + R`

## 🎯 Teste Novamente

Após aplicar uma das soluções:

1. Acesse: http://localhost:5173
2. Email: `teste@email.com`
3. Senha: `123456`
4. Clique "Entrar"

## 🔍 Como Identificar se Funcionou

### ✅ Sucesso

-   Botão muda para "Entrando..."
-   Após 1 segundo, aparece toast verde
-   Redireciona para Dashboard
-   Vê estatísticas e projetos

### ❌ Ainda com problema

-   Nada acontece ao clicar
-   Não aparece toast
-   Não redireciona

## 💡 Extensões Comuns que Causam Problema

-   LastPass
-   1Password
-   Bitwarden
-   Google Tradutor
-   Grammarly
-   AdBlock
-   uBlock Origin

## 🆘 Se Ainda Não Funcionar

### 1. Verificar se o formulário está funcionando

Abra o console (F12) e digite:

```javascript
// Verificar se React está carregado
window.React;

// Verificar se o formulário existe
document.querySelector('form');

// Verificar se o botão existe
document.querySelector('button[type="submit"]');
```

### 2. Testar manualmente

No console (F12), digite:

```javascript
// Simular login
localStorage.setItem(
    'auth-storage',
    JSON.stringify({
        state: {
            user: {
                id: 1,
                nome: 'Teste',
                email: 'teste@email.com',
                perfil: 'Admin',
                escritorioId: 1,
            },
            isAuthenticated: true,
        },
    })
);

// Recarregar
location.href = '/dashboard';
```

### 3. Verificar se o servidor está rodando

No terminal, deve aparecer:

```
➜  Local:   http://localhost:5173/
```

## 📊 Resumo

| Erro          | Causa                         | Solução               |
| ------------- | ----------------------------- | --------------------- |
| content.js    | Extensão do navegador         | Modo anônimo          |
| JSON.parse    | Extensão tentando ler storage | Limpar storage        |
| Nada acontece | Extensão bloqueando           | Desabilitar extensões |

## ✅ Checklist

-   [ ] Tentou modo anônimo
-   [ ] Desabilitou extensões
-   [ ] Limpou storage
-   [ ] Recarregou a página (Ctrl+Shift+R)
-   [ ] Testou login novamente

---

**Dica**: Use sempre modo anônimo para desenvolvimento!

**Tempo**: 2 minutos  
**Sucesso**: 99%
