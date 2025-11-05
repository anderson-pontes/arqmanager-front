import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { UserEscritorio } from '@/types';

export function SelecionarEscritorio() {
    const navigate = useNavigate();
    const { user, setEscritorioAtual, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);

    if (!user || !user.escritorios || user.escritorios.length === 0) {
        navigate('/login');
        return null;
    }

    const handleSelectEscritorio = async (escritorio: UserEscritorio) => {
        setLoading(true);

        // Simula delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            // Atualiza o escritório atual no store
            setEscritorioAtual(escritorio);

            toast.success(`Escritório selecionado: ${escritorio.escritorio.nomeFantasia}`);

            // Redireciona para o dashboard
            navigate('/dashboard');
        } catch (error) {
            toast.error('Erro ao selecionar escritório');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Selecione um Escritório</h1>
                    <p className="text-muted-foreground">
                        Olá, {user.nome}! Você tem acesso a {user.escritorios.length}{' '}
                        {user.escritorios.length === 1 ? 'escritório' : 'escritórios'}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {user.escritorios.map((userEscritorio) => (
                        <Card
                            key={userEscritorio.id}
                            className="hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => handleSelectEscritorio(userEscritorio)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${userEscritorio.escritorio.cor}20`,
                                        }}
                                    >
                                        <Building2
                                            className="h-6 w-6"
                                            style={{ color: userEscritorio.escritorio.cor }}
                                        />
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <CardTitle className="text-lg">
                                    {userEscritorio.escritorio.nomeFantasia}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {userEscritorio.escritorio.razaoSocial}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Seu perfil:</span>
                                        <Badge variant="secondary">{userEscritorio.perfil}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge
                                            className={
                                                userEscritorio.ativo
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-500'
                                            }
                                        >
                                            {userEscritorio.ativo ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground pt-2 border-t">
                                        {userEscritorio.escritorio.endereco}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>

                {loading && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Carregando escritório...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
