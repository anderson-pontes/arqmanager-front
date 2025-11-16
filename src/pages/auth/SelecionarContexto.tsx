import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Building2, Check, Shield } from 'lucide-react';
import type { EscritorioContextInfo } from '@/types';

const PERFIS = ['Administrador', 'Coordenador de Projetos', 'Financeiro', 'Produção', 'Terceirizado'];

export function SelecionarContexto() {
    const navigate = useNavigate();
    const { user, isSystemAdmin, setContext, setAdminMode, logout } = useAuthStore();
    const [escritorios, setEscritorios] = useState<EscritorioContextInfo[]>([]);
    const [selectedEscritorio, setSelectedEscritorio] = useState<number | null>(null);
    const [selectedPerfil, setSelectedPerfil] = useState<string | null>(null);
    const [selectedMode, setSelectedMode] = useState<'escritorio' | 'admin'>('escritorio');
    const [loading, setLoading] = useState(false);
    const [loadingEscritorios, setLoadingEscritorios] = useState(true);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            if (selectedMode === 'admin') {
                // Modo administrativo
                await setAdminMode();
                toast.success('Modo administrativo ativado!');
                navigate('/admin');
            } else {
                // Modo escritório
                if (!selectedEscritorio) {
                    toast.error('Selecione um escritório');
                    setLoading(false);
                    return;
                }
                if (!selectedPerfil) {
                    toast.error('Selecione um perfil');
                    setLoading(false);
                    return;
                }
                await setContext(selectedEscritorio, selectedPerfil);
                toast.success('Contexto definido com sucesso!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Erro ao definir contexto:', error);
            toast.error(error?.response?.data?.detail || 'Erro ao definir contexto');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadEscritorios();
    }, []);

    const loadEscritorios = async () => {
        setLoadingEscritorios(true);
        try {
            const { authService } = await import('@/api/services/auth.service');
            const data = await authService.getAvailableEscritorios();
            
            console.log('📋 Escritórios disponíveis:', data);
            console.log('📋 Perfis por escritório:', data.map(e => ({ id: e.id, nome: e.nome_fantasia, perfis: e.perfis })));
            
            setEscritorios(data);
            
            // Se houver apenas um escritório e não for admin do sistema
            if (data.length === 1 && !isSystemAdmin) {
                const escritorio = data[0];
                setSelectedEscritorio(escritorio.id);
                
                console.log('📋 Escritório único selecionado:', escritorio);
                console.log('📋 Perfis disponíveis:', escritorio.perfis);
                
                // Se tiver apenas um perfil, entrar direto
                if (escritorio.perfis && escritorio.perfis.length === 1) {
                    setSelectedPerfil(escritorio.perfis[0]);
                    setSelectedEscritorio(escritorio.id);
                    // Entrar automaticamente após um pequeno delay
                    setTimeout(async () => {
                        setLoading(true);
                        try {
                            await setContext(escritorio.id, escritorio.perfis[0]);
                            toast.success('Contexto definido com sucesso!');
                            navigate('/dashboard');
                        } catch (error: any) {
                            console.error('Erro ao definir contexto:', error);
                            toast.error(error?.response?.data?.detail || 'Erro ao definir contexto');
                        } finally {
                            setLoading(false);
                        }
                    }, 500);
                    return;
                } else if (escritorio.perfis && escritorio.perfis.length > 0) {
                    // Se tiver múltiplos perfis, selecionar o primeiro como padrão
                    setSelectedPerfil(escritorio.perfis[0]);
                } else {
                    console.warn('⚠️ Nenhum perfil encontrado para o escritório:', escritorio);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar escritórios:', error);
            toast.error('Erro ao carregar escritórios');
        } finally {
            setLoadingEscritorios(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loadingEscritorios) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando escritórios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-purple-50 via-white to-purple-100">
            <Card className="w-full max-w-3xl shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        Selecionar Contexto
                    </CardTitle>
                    <CardDescription>
                        {isSystemAdmin
                            ? 'Como administrador do sistema, você pode acessar um escritório específico ou a área administrativa geral.'
                            : 'Escolha o escritório que deseja acessar'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Seleção de Modo (apenas para admin do sistema) */}
                    {isSystemAdmin && (
                        <div>
                            <Label className="text-base font-semibold mb-3 block">Modo de Acesso</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <Card
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedMode === 'escritorio'
                                            ? 'ring-2 ring-primary bg-primary/5'
                                            : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => setSelectedMode('escritorio')}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-semibold">Acessar Escritório</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Trabalhar dentro de um escritório específico
                                                </p>
                                            </div>
                                            {selectedMode === 'escritorio' && (
                                                <Check className="h-5 w-5 text-primary ml-auto" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedMode === 'admin'
                                            ? 'ring-2 ring-primary bg-primary/5'
                                            : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => setSelectedMode('admin')}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-semibold">Área Administrativa</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Gerenciar escritórios e administradores
                                                </p>
                                            </div>
                                            {selectedMode === 'admin' && (
                                                <Check className="h-5 w-5 text-primary ml-auto" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Seleção de Escritório (apenas se modo escritório) */}
                    {selectedMode === 'escritorio' && (
                        <div>
                            <Label className="text-base font-semibold mb-3 block">Escritório</Label>
                            <Select
                                value={selectedEscritorio?.toString() || ''}
                                onValueChange={(value) => {
                                    const escritorioId = parseInt(value);
                                    setSelectedEscritorio(escritorioId);
                                    // Buscar escritório selecionado
                                    const escritorio = escritorios.find(esc => esc.id === escritorioId);
                                    if (escritorio) {
                                        // Se não for admin e tiver perfis, usar o primeiro perfil
                                        if (!isSystemAdmin && escritorio.perfis && escritorio.perfis.length > 0) {
                                            setSelectedPerfil(escritorio.perfis[0]);
                                        } else if (isSystemAdmin) {
                                            // Admin pode escolher qualquer perfil
                                            setSelectedPerfil(null);
                                        }
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um escritório" />
                                </SelectTrigger>
                                <SelectContent>
                                    {escritorios.map((esc) => (
                                        <SelectItem key={esc.id} value={esc.id.toString()}>
                                            {esc.nome_fantasia}
                                            {esc.perfis && esc.perfis.length > 0 && (
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    ({esc.perfis.length} perfil{esc.perfis.length > 1 ? 's' : ''})
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Seleção de Perfil */}
                    {selectedMode === 'escritorio' && selectedEscritorio && (
                        <div>
                            <Label className="text-base font-semibold mb-2 block">Perfil</Label>
                            {(() => {
                                const escritorio = escritorios.find(esc => esc.id === selectedEscritorio);
                                const perfisDisponiveis = escritorio?.perfis || [];
                                
                                // Se for admin do sistema, pode escolher qualquer perfil
                                const perfisParaMostrar = isSystemAdmin ? PERFIS : perfisDisponiveis;
                                
                                if (perfisParaMostrar.length === 0) {
                                    return (
                                        <p className="text-sm text-muted-foreground">
                                            Nenhum perfil disponível para este escritório
                                        </p>
                                    );
                                }
                                
                                return (
                                    <>
                                        <Select 
                                            value={selectedPerfil || ''} 
                                            onValueChange={setSelectedPerfil}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione um perfil" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {perfisParaMostrar.map((perfil) => (
                                                    <SelectItem key={perfil} value={perfil}>
                                                        {perfil}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {isSystemAdmin 
                                                ? 'Escolha o perfil que deseja simular neste escritório'
                                                : `Você possui ${perfisDisponiveis.length} perfil${perfisDisponiveis.length > 1 ? 's' : ''} neste escritório`}
                                        </p>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleConfirm}
                            disabled={(selectedMode === 'escritorio' && !selectedEscritorio) || loading}
                            className="flex-1"
                            size="lg"
                        >
                            {loading
                                ? 'Carregando...'
                                : selectedMode === 'admin'
                                ? 'Acessar Área Administrativa'
                                : 'Confirmar e Entrar'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            disabled={loading}
                            size="lg"
                        >
                            Sair
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

