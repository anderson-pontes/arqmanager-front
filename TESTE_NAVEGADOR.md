# 🌐 Guia de Teste no Navegador - Sistema Multi-Escritório

**Data:** 2025-01-09

---

## 🚀 Como Testar

### Pré-requisitos

1. ✅ Backend rodando em `http://localhost:8000`
2. ✅ Frontend rodando em `http://localhost:5173` (ou porta do Vite)

---

## 📋 Passo a Passo para Testar

### 1. Iniciar o Backend

```bash
cd arqmanager-backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

### 2. Iniciar o Frontend

```bash
cd arqmanager-front
npm run dev
```

### 3. Acessar no Navegador

Abra: `http://localhost:5173` (ou a porta que o Vite indicar)

---

## 🧪 Cenários de Teste

### ✅ Teste 1: Login de Admin do Sistema

**Credenciais:**
- Email: `admin@sistema.com`
- Senha: `admin123`

**O que verificar:**
1. ✅ Login bem-sucedido
2. ✅ Redirecionamento para `/selecionar-contexto`
3. ✅ Lista de escritórios disponíveis exibida
4. ✅ Opção de selecionar perfil (Admin, Gerente, Financeiro, Técnico, Colaborador)

**Resultado esperado:**
- Após login, deve aparecer a tela de seleção de contexto
- Admin pode escolher qualquer escritório e perfil

---

### ✅ Teste 2: Seleção de Contexto

**O que fazer:**
1. Selecionar um escritório (clicar no card)
2. Selecionar um perfil (se for admin do sistema)
3. Clicar em "Confirmar e Entrar"

**O que verificar:**
1. ✅ Redirecionamento para `/dashboard`
2. ✅ Contexto salvo no store
3. ✅ Token atualizado com contexto
4. ✅ Componente ContextSwitcher no header mostra escritório/perfil selecionado

---

### ✅ Teste 3: Troca de Contexto

**O que fazer:**
1. Clicar no botão de escritório no header (ContextSwitcher)
2. Selecionar "Trocar Escritório/Perfil"
3. Escolher novo escritório/perfil
4. Confirmar

**O que verificar:**
1. ✅ Redirecionamento para `/selecionar-contexto`
2. ✅ Novo contexto aplicado
3. ✅ Token atualizado
4. ✅ Dados filtrados pelo novo contexto

---

### ✅ Teste 4: Proteção de Rotas

**O que fazer:**
1. Fazer login
2. Tentar acessar `/dashboard` sem selecionar contexto

**O que verificar:**
1. ✅ Redirecionamento automático para `/selecionar-contexto`
2. ✅ Não é possível acessar rotas protegidas sem contexto

---

### ✅ Teste 5: Persistência do Contexto

**O que fazer:**
1. Fazer login e selecionar contexto
2. Recarregar a página (F5)

**O que verificar:**
1. ✅ Contexto mantido após reload
2. ✅ Não precisa selecionar contexto novamente
3. ✅ Token válido

---

## 🐛 Problemas Comuns e Soluções

### Problema: "Erro ao fazer login"
**Solução:**
- Verificar se backend está rodando
- Verificar credenciais: `admin@sistema.com` / `admin123`
- Verificar console do navegador para erros

### Problema: "Escritório não selecionado"
**Solução:**
- Verificar se fez login como admin do sistema
- Verificar se selecionou contexto após login
- Limpar localStorage e tentar novamente

### Problema: "CORS Error"
**Solução:**
- Verificar se backend tem CORS configurado
- Verificar URL da API no frontend

### Problema: "Token inválido"
**Solução:**
- Fazer logout e login novamente
- Limpar localStorage
- Verificar se backend está gerando tokens corretamente

---

## 📊 Checklist de Teste

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando (porta do Vite)
- [ ] Login de admin do sistema funciona
- [ ] Redirecionamento para seleção de contexto
- [ ] Lista de escritórios exibida
- [ ] Seleção de escritório funciona
- [ ] Seleção de perfil funciona (admin)
- [ ] Contexto salvo após seleção
- [ ] Redirecionamento para dashboard
- [ ] ContextSwitcher no header funciona
- [ ] Troca de contexto funciona
- [ ] Proteção de rotas funciona
- [ ] Persistência após reload funciona

---

## 🎯 Resultado Esperado

Após todos os testes, você deve conseguir:

1. ✅ Fazer login como admin do sistema
2. ✅ Ver tela de seleção de contexto
3. ✅ Escolher escritório e perfil
4. ✅ Acessar dashboard com contexto aplicado
5. ✅ Trocar contexto a qualquer momento
6. ✅ Ver contexto atual no header

---

**Boa sorte com os testes! 🚀**






