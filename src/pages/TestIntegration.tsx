import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useClientes } from '@/hooks/useClientes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestIntegration() {
    const { login, logout, isAuthenticated, getUser, loading: authLoading, error: authError } = useAuth();
    const { clientes, total, loading: clientesLoading, error: clientesError, fetchClientes } = useClientes(undefined, false);

    const [email, setEmail] = useState('admin@arqmanager.com');
    const [password, setPassword] = useState('admin123');

    const handleLogin = async () => {
        try {
            await login({ email, senha: password });
            alert('Login realizado com sucesso!');
        } catch (err) {
            console.error('Erro no login:', err);
        }
    };

    const handleLogout = async () => {
        await logout();
        alert('Logout realizado!');
    };

    const handleFetchClientes = () => {
        fetchClientes();
    };

    const user = getUser();

    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-3xl font-bold">🧪 Teste de Integração Front → Back</h1>

            {/* Card de Autenticação */}
            <Card>
                <CardHeader>
                    <CardTitle>1️⃣ Autenticação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isAuthenticated() ? (
                        <>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleLogin} disabled={authLoading}>
                                {authLoading ? 'Carregando...' : 'Login'}
                            </Button>
                            {authError && (
                                <p className="text-red-500 text-sm">❌ {authError}</p>
                            )}
                        </>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-green-600 font-semibold">✅ Autenticado!</p>
                            {user && (
                                <div className="text-sm space-y-1">
                                    <p><strong>Nome:</strong> {user.nome}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Escritório:</strong> {user.escritorio_id}</p>
                                </div>
                            )}
                            <Button onClick={handleLogout} variant="destructive">
                                Logout
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Card de Clientes */}
            {isAuthenticated() && (
                <Card>
                    <CardHeader>
                        <CardTitle>2️⃣ Listagem de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleFetchClientes} disabled={clientesLoading}>
                            {clientesLoading ? 'Carregando...' : 'Buscar Clientes'}
                        </Button>

                        {clientesError && (
                            <p className="text-red-500 text-sm">❌ {clientesError}</p>
                        )}

                        {clientes.length > 0 && (
                            <div className="space-y-2">
                                <p className="font-semibold">
                                    ✅ {total} clientes encontrados
                                </p>
                                <div className="max-h-96 overflow-y-auto border rounded p-4 space-y-2">
                                    {clientes.map((cliente) => (
                                        <div
                                            key={cliente.id}
                                            className="p-3 bg-gray-50 rounded border"
                                        >
                                            <p className="font-semibold">{cliente.nome}</p>
                                            <p className="text-sm text-gray-600">
                                                {cliente.email || 'Sem email'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ID: {cliente.id} | Tipo: {cliente.tipo_pessoa}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Status da Conexão */}
            <Card>
                <CardHeader>
                    <CardTitle>📊 Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            <strong>Backend:</strong> http://localhost:8000/api/v1
                        </p>
                        <p>
                            <strong>Autenticado:</strong>{' '}
                            {isAuthenticated() ? '✅ Sim' : '❌ Não'}
                        </p>
                        <p>
                            <strong>Clientes carregados:</strong> {clientes.length}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
