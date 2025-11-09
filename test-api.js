// Script de teste rápido da API
// Execute com: node test-api.js

const axios = require('axios');

const API_URL = 'http://localhost:8000/api/v1';

async function testAPI() {
  console.log('🧪 Testando conexão com API...\n');

  try {
    // Teste 1: Health check
    console.log('1️⃣ Testando health check...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check OK:', healthResponse.data);
    console.log('');

    // Teste 2: Login
    console.log('2️⃣ Testando login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@arqmanager.com',
      password: 'admin123',
    });
    console.log('✅ Login OK');
    console.log('   Token:', loginResponse.data.access_token.substring(0, 50) + '...');
    console.log('   Usuário:', loginResponse.data.user.nome);
    console.log('');

    const token = loginResponse.data.access_token;

    // Teste 3: Listar clientes
    console.log('3️⃣ Testando listagem de clientes...');
    const clientesResponse = await axios.get(`${API_URL}/clientes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Clientes OK');
    console.log('   Total:', clientesResponse.data.total);
    console.log('   Primeiros 3:');
    clientesResponse.data.items.slice(0, 3).forEach((cliente) => {
      console.log(`   - ${cliente.nome} (${cliente.email || 'sem email'})`);
    });
    console.log('');

    // Teste 4: Buscar cliente específico
    if (clientesResponse.data.items.length > 0) {
      const primeiroCliente = clientesResponse.data.items[0];
      console.log('4️⃣ Testando busca de cliente específico...');
      const clienteResponse = await axios.get(
        `${API_URL}/clientes/${primeiroCliente.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('✅ Cliente específico OK');
      console.log('   ID:', clienteResponse.data.id);
      console.log('   Nome:', clienteResponse.data.nome);
      console.log('   Tipo:', clienteResponse.data.tipo_pessoa);
      console.log('');
    }

    console.log('🎉 Todos os testes passaram!');
    console.log('');
    console.log('📊 Resumo:');
    console.log('   ✅ Backend está rodando');
    console.log('   ✅ Autenticação funciona');
    console.log('   ✅ Listagem de clientes funciona');
    console.log('   ✅ Busca de cliente funciona');
    console.log('');
    console.log('🚀 Pronto para integrar com o front-end!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    } else if (error.request) {
      console.error('   ⚠️ Backend não está respondendo');
      console.error('   Certifique-se de que o backend está rodando em', API_URL);
    }
    process.exit(1);
  }
}

testAPI();
