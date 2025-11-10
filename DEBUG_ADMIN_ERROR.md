# 🔍 Debug: Erro ao Criar Administrador do Sistema

## Como debugar o erro 400

### 1. Abrir DevTools no Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba **Network** (Rede)

### 2. Tentar criar administrador
- Preencha o formulário
- Clique em "Criar Administrador"
- Observe a requisição na aba Network

### 3. Verificar a requisição
- Procure por uma requisição `POST` para `/admin/system-admin`
- Clique na requisição
- Vá para a aba **Payload** ou **Request** para ver o que foi enviado
- Vá para a aba **Response** para ver a resposta do servidor

### 4. Verificar o console
- Vá para a aba **Console**
- Procure por erros em vermelho
- O erro deve mostrar a mensagem detalhada do backend

### 5. Informações para compartilhar
Se o erro persistir, compartilhe:
- **Status Code**: (ex: 400, 422, 403)
- **Mensagem de erro**: (da aba Response ou Console)
- **Payload enviado**: (o que está sendo enviado na requisição)
- **Headers**: (especialmente o Authorization)

## Possíveis causas

1. **Email já cadastrado**: Tente com um email diferente
2. **CPF já cadastrado**: Se forneceu CPF, tente com outro ou deixe vazio
3. **Validação do Pydantic**: Algum campo obrigatório faltando
4. **Token inválido**: Faça logout e login novamente
5. **Não está em modo administrativo**: Acesse a seleção de contexto e escolha "Área Administrativa"

## Teste rápido

Tente criar um admin com:
- **Nome**: Teste Admin
- **Email**: testeadmin@teste.com (use um email único)
- **Senha**: teste123
- **CPF**: (deixe vazio)
- **Telefone**: (deixe vazio)

Se funcionar, o problema pode ser com o email ou CPF que você está tentando usar.

