# 🔧 Resolver Tela em Branco - Guia Definitivo

## Problema

Tela em branco com erros no console sobre módulos não encontrados.

## Solução Definitiva

### Método 1: Script Automático (Recomendado)

1. **Parar o servidor** (Ctrl + C)

2. **Executar script de limpeza:**

```powershell
.\limpar-cache.ps1
```

3. **Reiniciar servidor:**

```bash
npm run dev
```

4. **Limpar cache do navegador:** Ctrl + Shift + R

---

### Método 2: Manual

1. **Parar o servidor** (Ctrl + C)

2. **Limpar cache:**

```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

3. **Reiniciar:**

```bash
npm run dev
```

4. **Limpar navegador:** Ctrl + Shift + R

---

### Método 3: Limpeza Completa (Se os outros não funcionarem)

1. **Parar servidor** (Ctrl + C)

2. **Limpar tudo:**

```powershell
Remove-Item -Recurse -Force node_modules, node_modules\.vite, dist, package-lock.json
```

3. **Reinstalar:**

```bash
npm install
```

4. **Iniciar:**

```bash
npm run dev
```

5. **Limpar navegador:** Ctrl + Shift + R

---

## Por que isso acontece?

O Vite mantém um cache de módulos em `node_modules/.vite` para acelerar o desenvolvimento. Às vezes esse cache fica desatualizado e causa erros de importação.

## Checklist de Verificação

Após aplicar a solução:

-   [ ] Servidor iniciou sem erros
-   [ ] Console do navegador sem erros
-   [ ] Página de login apareceu
-   [ ] Possível fazer login
-   [ ] Dashboard carrega

## Teste Rápido

1. Acesse: http://localhost:5173
2. Login: teste@email.com
3. Senha: 123456
4. Deve ver o Dashboard

## Dica Pro

Sempre que fizer mudanças grandes nos arquivos de tipos ou configuração, limpe o cache:

```powershell
.\limpar-cache.ps1
```

---

**Tempo**: 1-2 minutos  
**Sucesso**: 99%  
**Dificuldade**: Fácil
