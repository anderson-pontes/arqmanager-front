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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                            ARQ
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">ARQManager</CardTitle>
                    <CardDescription className="text-center">
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
