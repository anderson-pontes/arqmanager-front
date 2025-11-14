# 🧪 Guia Completo de Teste - Sistema Multi-Escritório

**Data:** 2025-01-09

---

## 🚀 Iniciar Servidores

### Backend (Terminal 1)
```bash
cd arqmanager-backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### Frontend (Terminal 2)
```bash
cd arqmanager-front
npm run dev
```

**URLs:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173 (ou porta indicada pelo Vite)

---

## ✅ Checklist de Teste

### 1. Login de Admin do Sistema

**Credenciais:**
```
Email: admin@sistema.com
Senha: admin123
```

**Passos:**
1. Acesse http://localhost:5173
2. Faça login com as credenciais acima
3. Verifique se aparece mensagem de sucesso
4. Verifique se redireciona para `/selecionar-contexto`

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento para seleção de contexto
- ✅ Toast de boas-vindas

---

### 2. Seleção de Contexto

**Passos:**
1. Na tela de seleção de contexto, você deve ver:
   - Lista de escritórios disponíveis
   - Dropdown de seleção de perfil (apenas para admin)
2. Selecione um escritório (clique no card)
3. Selecione um perfil (ex: "Financeiro")
4. Clique em "Confirmar e Entrar"

**Resultado Esperado:**
- ✅ Escritório selecionado fica destacado
- ✅ Perfil selecionado aparece no dropdown
- ✅ Após confirmar, redireciona para `/dashboard`
- ✅ Toast de sucesso "Contexto definido com sucesso!"

---

### 3. Verificar Contexto no Header

**Passos:**
1. Após entrar no dashboard, verifique o header
2. Procure pelo botão com nome do escritório
3. Clique no botão para ver o dropdown

**Resultado Esperado:**
- ✅ Botão mostra nome do escritório selecionado
- ✅ Se for admin, mostra o perfil entre parênteses
- ✅ Dropdown mostra:
  - Nome do escritório
  - Perfil atual
  - Badge "Admin do Sistema" (se aplicável)
  - Opção "Trocar Escritório/Perfil"
  - Opção "Sair"

---

### 4. Trocar Contexto

**Passos:**
1. No header, clique no botão do escritório
2. Selecione "Trocar Escritório/Perfil"
3. Escolha um novo escritório/perfil
4. Confirme

**Resultado Esperado:**
- ✅ Redireciona para `/selecionar-contexto`
- ✅ Novo contexto aplicado
- ✅ Token atualizado
- ✅ Volta para dashboard com novo contexto

---

### 5. Proteção de Rotas

**Passos:**
1. Faça login
2. Sem selecionar contexto, tente acessar diretamente `/dashboard` na URL

**Resultado Esperado:**
- ✅ Redirecionamento automático para `/selecionar-contexto`
- ✅ Não é possível acessar sem contexto definido

---

### 6. Persistência do Contexto

**Passos:**
1. Faça login e selecione contexto
2. Recarregue a página (F5)
3. Verifique se ainda está no dashboard

**Resultado Esperado:**
- ✅ Contexto mantido após reload
- ✅ Não precisa selecionar contexto novamente
- ✅ Token válido

---

### 7. Logout

**Passos:**
1. Clique no botão do escritório no header
2. Selecione "Sair"

**Resultado Esperado:**
- ✅ Redirecionamento para `/login`
- ✅ Tokens removidos
- ✅ Contexto limpo

---

## 🔍 Verificações no Console do Navegador

Abra o DevTools (F12) e verifique:

### Console Tab
- ✅ Sem erros em vermelho
- ✅ Logs de sucesso do login
- ✅ Logs de seleção de contexto

### Network Tab
- ✅ Requisição `POST /auth/login` com status 200
- ✅ Requisição `GET /auth/available-escritorios` com status 200
- ✅ Requisição `POST /auth/set-context` com status 200
- ✅ Todas as requisições têm header `Authorization: Bearer <token>`

### Application Tab > Local Storage
- ✅ `accessToken` presente
- ✅ `refreshToken` presente
- ✅ `auth-storage` com dados do usuário e contexto

---

## 🐛 Troubleshooting

### Erro: "Network Error" ou "CORS Error"
**Solução:**
- Verificar se backend está rodando
- Verificar URL da API no `src/config/api.ts`
- Verificar CORS no backend

### Erro: "Token inválido"
**Solução:**
- Limpar localStorage: `localStorage.clear()`
- Fazer login novamente
- Verificar se backend está gerando tokens corretamente

### Erro: "Escritório não selecionado"
**Solução:**
- Verificar se selecionou contexto após login
- Limpar localStorage e tentar novamente
- Verificar se `currentContext` está no store

### Tela branca
**Solução:**
- Verificar console do navegador para erros
- Verificar se todas as dependências estão instaladas
- Tentar limpar cache: `npm run dev -- --force`

---

## 📊 Resultado Final Esperado

Após todos os testes, você deve conseguir:

1. ✅ Fazer login como admin do sistema
2. ✅ Ver tela de seleção de contexto com escritórios
3. ✅ Escolher escritório e perfil
4. ✅ Acessar dashboard com contexto aplicado
5. ✅ Ver contexto atual no header
6. ✅ Trocar contexto a qualquer momento
7. ✅ Contexto persiste após reload
8. ✅ Logout funciona corretamente

---

## 🎉 Sucesso!

Se todos os testes passaram, o sistema está funcionando perfeitamente! 🚀







