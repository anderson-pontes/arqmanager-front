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
} from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import logoArqManager from '@/assets/logoarmanager.png';
import type { User } from '@/types';

const loginSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const { setAuth, setContext } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            // ✅ Login real com backend
            const { authService } = await import('@/api/services/auth.service');
            const response = await authService.login(data);

            // Salva tokens
            authService.saveTokens(response.access_token, response.refresh_token);

            // Adapta usuário do backend para o formato do frontend
            const user: User = {
                id: response.user.id,
                nome: response.user.nome,
                email: response.user.email,
                perfil: response.user.perfil || 'Colaborador',
                escritorios: response.available_escritorios.map(e => ({
                    id: e.id,
                    escritorio: {
                        id: e.id,
                        nomeFantasia: e.nome_fantasia,
                        razaoSocial: e.razao_social,
                        cor: e.cor
                    },
                    perfil: e.perfis && e.perfis.length > 0 ? e.perfis[0] : 'Produção', // Compatibilidade
                    perfis: e.perfis || ['Produção'], // Múltiplos perfis
                    ativo: true,
                    dataVinculo: new Date().toISOString()
                })),
                foto: response.user.foto,
                isSystemAdmin: response.is_system_admin,
            };

            // Salva usuário no store
            setAuth(
                user,
                response.access_token,
                response.refresh_token,
                response.requires_escritorio_selection,
                response.is_system_admin
            );

            toast.success(`Bem-vindo, ${user.nome}!`);

            // Redirecionar baseado no contexto
            if (response.requires_escritorio_selection || response.is_system_admin) {
                navigate('/selecionar-contexto');
            } else {
                // Usuário comum com 1 escritório: definir automaticamente
                if (user.escritorios.length === 1) {
                    const escritorio = user.escritorios[0];
                    // Se tiver apenas um perfil, entrar direto
                    if (escritorio.perfis && escritorio.perfis.length === 1) {
                        try {
                            await setContext(escritorio.escritorio.id, escritorio.perfis[0]);
                            navigate('/dashboard');
                            return;
                        } catch (error) {
                            console.error('Erro ao definir contexto automático:', error);
                        }
                    } else {
                        // Se tiver múltiplos perfis, ir para seleção
                        navigate('/selecionar-contexto');
                        return;
                    }
                }
                navigate('/dashboard');
            }
        } catch (error: any) {
            // Trata erros específicos com mensagens claras
            let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';

            // Verificar diferentes formatos de resposta de erro
            const detail = error.response?.data?.detail || error.response?.data?.message || error.message || '';
            
            if (detail) {
                if (typeof detail === 'string') {
                    // Mensagens específicas do backend
                    const detailLower = detail.toLowerCase();
                    
                    if (detailLower.includes('email não encontrado') || detailLower.includes('email nao encontrado')) {
                        errorMessage = 'Email não encontrado. Verifique o email informado.';
                    } else if (detailLower.includes('senha incorreta')) {
                        errorMessage = 'Senha incorreta. Verifique a senha informada.';
                    } else if (detailLower.includes('inativo')) {
                        errorMessage = 'Usuário inativo. Entre em contato com o administrador.';
                    } else if (detailLower.includes('escritório') || detailLower.includes('escritorio')) {
                        errorMessage = detail;
                    } else {
                        errorMessage = detail;
                    }
                } else if (Array.isArray(detail)) {
                    errorMessage = detail.map((e: any) => e.msg || e.message || e).join(', ');
                }
            }

            // Exibir toast de erro
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-100">
            {/* Formas Geométricas de Fundo - Inspiradas em Arquitetura */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Retângulos grandes - Estruturas */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/5 rotate-12 rounded-3xl transform translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/10 -rotate-12 rounded-3xl transform -translate-x-24 translate-y-24" />

                {/* Círculos - Elementos modernos */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl" />

                {/* Linhas e grades - Plantas arquitetônicas */}
                <div className="absolute top-1/3 right-1/3 w-48 h-48 border-2 border-violet-400/10 rotate-45 rounded-lg" />
                <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-violet-400/10 -rotate-45 rounded-lg" />

                {/* Pequenos quadrados - Detalhes */}
                <div className="absolute top-20 left-20 w-16 h-16 bg-violet-400/5 rounded-lg rotate-12" />
                <div className="absolute bottom-20 right-20 w-20 h-20 bg-violet-400/5 rounded-lg -rotate-12" />
                <div className="absolute top-1/2 right-20 w-12 h-12 bg-violet-400/10 rounded-full" />
                <div className="absolute bottom-1/2 left-20 w-14 h-14 bg-violet-400/10 rounded-full" />

                {/* Triângulos - Telhados */}
                <div className="absolute top-40 right-40 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-violet-400/5 rotate-12" />
                <div className="absolute bottom-40 left-40 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[70px] border-b-violet-400/5 -rotate-12" />
            </div>

            {/* Card de Login - Com backdrop blur para efeito glassmorphism */}
            <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-white border-gray-300">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-6">
                        <img
                            src={logoArqManager}
                            alt="ARQManager Logo"
                            className="h-32 w-auto object-contain"
                        />
                    </div>
                    <CardDescription className="text-center text-base text-gray-800">
                        Entre com suas credenciais para acessar o sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-800">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                                disabled={loading}
                                className="border-gray-300"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha" className="text-gray-800">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                {...register('senha')}
                                disabled={loading}
                                className="border-gray-300"
                            />
                            {errors.senha && (
                                <p className="text-sm text-red-400">{errors.senha.message}</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-violet-400 hover:bg-violet-500 text-white font-medium shadow-sm transition" 
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm text-gray-800 hover:text-violet-500"
                                onClick={() => navigate('/recuperar-senha')}
                            >
                                Esqueceu sua senha?
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="container mx-auto py-4">
                    <p className="text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} ARQManager. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
