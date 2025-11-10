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

const PERFIS = ['Admin', 'Gerente', 'Colaborador', 'Financeiro', 'Técnico'];

export function SelecionarContexto() {
    const navigate = useNavigate();
    const { user, isSystemAdmin, setContext, setAdminMode, logout } = useAuthStore();
    const [escritorios, setEscritorios] = useState<EscritorioContextInfo[]>([]);
    const [selectedEscritorio, setSelectedEscritorio] = useState<number | null>(null);
    const [selectedPerfil, setSelectedPerfil] = useState<string>('Colaborador');
    const [selectedMode, setSelectedMode] = useState<'escritorio' | 'admin'>('escritorio');
    const [loading, setLoading] = useState(false);
    const [loadingEscritorios, setLoadingEscritorios] = useState(true);

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
            setEscritorios(data);
            
            // Se houver apenas um escritório, selecionar automaticamente
            if (data.length === 1 && !isSystemAdmin) {
                setSelectedEscritorio(data[0].id);
                if (data[0].perfil) {
                    setSelectedPerfil(data[0].perfil);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar escritórios:', error);
            toast.error('Erro ao carregar escritórios');
        } finally {
            setLoadingEscritorios(false);
        }
    };

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-100">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {escritorios.map((esc) => (
                                <Card
                                    key={esc.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedEscritorio === esc.id
                                            ? 'ring-2 ring-primary bg-primary/5'
                                            : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => {
                                        setSelectedEscritorio(esc.id);
                                        // Se não for admin e tiver perfil definido, usar o perfil do escritório
                                        if (!isSystemAdmin && esc.perfil) {
                                            setSelectedPerfil(esc.perfil);
                                        }
                                    }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-5 h-5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: esc.cor || '#6366f1' }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{esc.nome_fantasia}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {esc.razao_social}
                                                </p>
                                                {esc.perfil && !isSystemAdmin && (
                                                    <p className="text-xs text-primary mt-1">
                                                        Perfil: {esc.perfil}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedEscritorio === esc.id && (
                                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        </div>
                    )}

                    {/* Seleção de Perfil (apenas para admin do sistema e modo escritório) */}
                    {isSystemAdmin && selectedMode === 'escritorio' && (
                        <div>
                            <Label className="text-base font-semibold mb-2 block">Perfil</Label>
                            <Select value={selectedPerfil} onValueChange={setSelectedPerfil}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PERFIS.map((perfil) => (
                                        <SelectItem key={perfil} value={perfil}>
                                            {perfil}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground mt-2">
                                Escolha o perfil que deseja simular neste escritório
                            </p>
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

