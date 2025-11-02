import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        console.log('🔐 Login iniciado com:', data);
        setLoading(true);
        try {
            // TODO: Substituir por chamada real à API
            // Simulando login com dados mock
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser = {
                id: 1,
                nome: 'Ana Silva',
                email: data.email,
                perfil: 'Administrador',
                escritorioId: 1,
            };

            console.log('✅ Autenticando usuário:', mockUser);
            setAuth(mockUser, 'mock-access-token', 'mock-refresh-token');
            toast.success('Login realizado com sucesso!');
            console.log('🚀 Redirecionando para dashboard...');
            navigate('/dashboard');
        } catch (error) {
            console.error('❌ Erro no login:', error);
            toast.error('Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-linear-to-br from-purple-50 via-white to-purple-100">
            {/* Formas Geométricas de Fundo - Inspiradas em Arquitetura */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Retângulos grandes - Estruturas */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rotate-12 rounded-3xl transform translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 -rotate-12 rounded-3xl transform -translate-x-24 translate-y-24" />

                {/* Círculos - Elementos modernos */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl" />

                {/* Linhas e grades - Plantas arquitetônicas */}
                <div className="absolute top-1/3 right-1/3 w-48 h-48 border-2 border-primary/10 rotate-45 rounded-lg" />
                <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-primary/10 -rotate-45 rounded-lg" />

                {/* Pequenos quadrados - Detalhes */}
                <div className="absolute top-20 left-20 w-16 h-16 bg-primary/5 rounded-lg rotate-12" />
                <div className="absolute bottom-20 right-20 w-20 h-20 bg-primary/5 rounded-lg -rotate-12" />
                <div className="absolute top-1/2 right-20 w-12 h-12 bg-primary/10 rounded-full" />
                <div className="absolute bottom-1/2 left-20 w-14 h-14 bg-primary/10 rounded-full" />

                {/* Triângulos - Telhados */}
                <div className="absolute top-40 right-40 w-0 h-0 border-l-40 border-l-transparent border-r-40 border-r-transparent border-b-60 border-b-primary/5 rotate-12" />
                <div className="absolute bottom-40 left-40 w-0 h-0 border-l-50 border-l-transparent border-r-50 border-r-transparent border-b-70 border-b-primary/5 -rotate-12" />
            </div>

            {/* Card de Login - Com backdrop blur para efeito glassmorphism */}
            <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-white/95">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-purple-600 text-primary-foreground font-bold text-2xl shadow-lg">
                                ARQ
                            </div>
                            {/* Detalhe geométrico no logo */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-300 rounded-sm rotate-45" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-center font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ARQManager
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        Entre com suas credenciais para acessar o sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                {...register('senha')}
                                disabled={loading}
                            />
                            {errors.senha && (
                                <p className="text-sm text-destructive">{errors.senha.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm"
                                onClick={() => navigate('/recuperar-senha')}
                            >
                                Esqueceu sua senha?
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
