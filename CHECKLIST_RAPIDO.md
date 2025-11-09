# ✅ Checklist Rápido - Testar Integração

## 🔧 Preparação:

-   [x] Código corrigido em `src/api/client.ts`
-   [x] Cache do Vite limpo
-   [ ] Frontend reiniciado

## 🚀 Iniciar Serviços:

### Terminal 1 - Backend:

```bash
cd arqmanager-backend
python -m uvicorn app.main:app --reload
```

✅ Deve mostrar: "Application startup complete"

### Terminal 2 - Frontend:

```bash
cd arqmanager-front
npm run dev
```

✅ Deve mostrar: "Local: http://localhost:5173/"

## 🧪 Testes:

### 1. Tela de Login

-   [ ] Acessar: http://localhost:5173
-   [ ] Deve carregar sem erros no console
-   [ ] Deve mostrar formulário de login

### 2. Página de Teste

-   [ ] Acessar: http://localhost:5173/test-integration
-   [ ] Deve carregar a página de teste
-   [ ] Deve mostrar formulário de login

### 3. Login

-   [ ] Email: admin@arqmanager.com
-   [ ] Senha: admin123
-   [ ] Clicar em "Login"
-   [ ] Deve mostrar "✅ Autenticado!"
-   [ ] Deve mostrar dados do usuário

### 4. Listagem de Clientes

-   [ ] Clicar em "Buscar Clientes"
-   [ ] Deve mostrar "✅ 135 clientes encontrados"
-   [ ] Deve listar os clientes

### 5. Logout

-   [ ] Clicar em "Logout"
-   [ ] Deve voltar para tela de login
-   [ ] Tokens devem ser removidos

## ❌ Se Algo Falhar:

### Erro no Console do Navegador:

```javascript
// Abrir DevTools (F12)
// Aba Console - ver erros
// Aba Network - ver requisições
```

### Backend não responde:

```bash
# Verificar se está rodando
curl http://localhost:8000/api/v1/health
```

### Frontend não carrega:

```bash
# Limpar cache novamente
cd arqmanager-front
.\limpar-cache-vite.ps1
npm run dev
```

### Erro 401 Unauthorized:

```javascript
// Console do navegador
localStorage.clear();
// Fazer login novamente
```

## 📊 Status Esperado:

```
✅ Backend: http://localhost:8000
✅ Frontend: http://localhost:5173
✅ Login: Funciona
✅ Clientes: 135 encontrados
✅ Logout: Funciona
```

## 🎯 Próximo Passo:

Após validar tudo funcionando:

-   **Etapa 2:** CRUD Completo de Clientes

---

**Tempo estimado:** 5-10 minutos
