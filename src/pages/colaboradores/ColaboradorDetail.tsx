import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Edit,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Building2,
    User,
    Shield,
    KeyRound,
} from 'lucide-react';
import { colaboradoresService, type Colaborador, type ColaboradorPerfil } from '@/api/services/colaboradores.service';
import { getInitials, formatPhone, formatCPF, formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function ColaboradorDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [colaborador, setColaborador] = useState<Colaborador | null>(null);
    const [perfis, setPerfis] = useState<ColaboradorPerfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (id) {
            fetchColaborador();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchColaborador = async () => {
        try {
            setLoading(true);
            const data = await colaboradoresService.getById(Number(id));
            setColaborador(data);
            
            // Buscar todos os perfis do colaborador
            try {
                const perfisData = await colaboradoresService.getPerfis(Number(id));
                console.log('Perfis recebidos do backend:', perfisData);
                // Garantir que não há duplicatas baseadas no ID
                const perfisUnicos = perfisData.filter((perfil, index, self) => 
                    index === self.findIndex(p => p.id === perfil.id)
                );
                console.log('Perfis únicos após filtro:', perfisUnicos);
                setPerfis(perfisUnicos || []);
            } catch (err: any) {
                console.error('Erro ao buscar perfis:', err);
                // Se for erro 404, o colaborador não está vinculado ao escritório, mas isso é ok
                // Se for erro 500, pode ser um problema temporário, então apenas logamos
                if (err.response?.status === 404) {
                    // Colaborador não tem perfis neste escritório, usar perfil padrão
                    setPerfis([]);
                } else if (err.response?.status === 500) {
                    // Erro do servidor, logar mas não bloquear a visualização
                    console.error('Erro ao buscar perfis (erro 500):', err.response?.data);
                    setPerfis([]);
                } else {
                    // Outros erros
                    setPerfis([]);
                }
            }
        } catch (error: any) {
            console.error('Erro ao buscar colaborador:', error);
            toast.error('Erro ao carregar dados do colaborador');
            navigate('/colaboradores');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = () => {
        setResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        if (!id || !newPassword) {
            toast.error('Por favor, informe a nova senha');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            await colaboradoresService.update(Number(id), { senha: newPassword });
            toast.success(`Senha de ${colaborador?.nome} alterada com sucesso!`);
            setResetPasswordDialogOpen(false);
            setNewPassword('');
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error);
            const errorMessage = error.response?.data?.detail || 'Erro ao alterar senha';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader title="Detalhes do Colaborador" showBack />
                <SkeletonCard lines={10} />
            </div>
        );
    }

    if (!colaborador) {
        return (
            <div>
                <PageHeader title="Colaborador não encontrado" showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            O colaborador solicitado não foi encontrado.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Detalhes do Colaborador"
                showBack
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleResetPassword}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Resetar Senha
                        </Button>
                        <Button onClick={() => navigate(`/colaboradores/${id}/editar`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Card Principal - Informações Básicas */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-3">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src={colaborador.foto} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                                        {getInitials(colaborador.nome)}
                                    </AvatarFallback>
                                </Avatar>
                                {colaborador.ativo ? (
                                    <Badge className="bg-green-500">Ativo</Badge>
                                ) : (
                                    <Badge variant="secondary">Inativo</Badge>
                                )}
                            </div>

                            {/* Informações */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {colaborador.nome}
                                    </h2>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {perfis.length > 0 ? (
                                            perfis.map((perfilItem, index) => {
                                                console.log(`Renderizando perfil ${index}:`, perfilItem);
                                                return (
                                                    <Badge key={`${perfilItem.id}-${index}`} variant="outline">
                                                        {perfilItem.perfil}
                                                    </Badge>
                                                );
                                            })
                                        ) : (
                                            <Badge variant="outline">
                                                {colaborador.perfil || 'Colaborador'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="font-medium">{colaborador.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Telefone
                                            </p>
                                            <p className="font-medium">
                                                {colaborador.telefone ? formatPhone(colaborador.telefone) : 'Não informado'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">CPF</p>
                                            <p className="font-medium">
                                                {formatCPF(colaborador.cpf)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Data de Nascimento
                                            </p>
                                            <p className="font-medium">
                                                {colaborador.data_nascimento ? formatDate(colaborador.data_nascimento) : 'Não informado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dados Bancários */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Dados Bancários
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(colaborador.tipo_pix && colaborador.tipo_pix.trim() !== '') || 
                         (colaborador.chave_pix && colaborador.chave_pix.trim() !== '') ? (
                            <>
                                {colaborador.tipo_pix && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tipo PIX</p>
                                        <p className="font-medium capitalize">
                                            {colaborador.tipo_pix === 'aleatoria' 
                                                ? 'Chave Aleatória' 
                                                : colaborador.tipo_pix === 'email'
                                                ? 'Email'
                                                : colaborador.tipo_pix === 'cpf'
                                                ? 'CPF'
                                                : colaborador.tipo_pix === 'cnpj'
                                                ? 'CNPJ'
                                                : colaborador.tipo_pix === 'telefone'
                                                ? 'Telefone'
                                                : colaborador.tipo_pix}
                                        </p>
                                    </div>
                                )}
                                {colaborador.chave_pix && (
                                    <>
                                        {colaborador.tipo_pix && <Separator />}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Chave PIX</p>
                                            <p className="font-medium break-all">{colaborador.chave_pix}</p>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum dado bancário cadastrado</p>
                        )}
                    </CardContent>
                </Card>

                {/* Informações do Sistema */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Perfis de Acesso</p>
                            {perfis.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {perfis.map((perfilItem, index) => {
                                        console.log(`Renderizando perfil no card Sistema ${index}:`, perfilItem);
                                        return (
                                            <Badge key={`sistema-${perfilItem.id}-${index}`} variant="outline">
                                                {perfilItem.perfil}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Badge variant="outline">
                                    {colaborador.perfil || 'Nenhum perfil atribuído'}
                                </Badge>
                            )}
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {colaborador.ativo ? (
                                <Badge className="bg-green-500 mt-1">Ativo</Badge>
                            ) : (
                                <Badge variant="secondary" className="mt-1">
                                    Inativo
                                </Badge>
                            )}
                        </div>
                        {colaborador.ultimo_acesso && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Último Acesso
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(colaborador.ultimo_acesso)}
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Estatísticas */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Estatísticas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Projetos Ativos
                            </p>
                            <p className="text-2xl font-bold">5</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Projetos Concluídos
                            </p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total de Projetos
                            </p>
                            <p className="text-2xl font-bold">17</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog - Alterar Senha */}
            <Dialog 
                open={resetPasswordDialogOpen} 
                onOpenChange={(open) => {
                    setResetPasswordDialogOpen(open);
                    if (!open) {
                        setNewPassword('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>
                            Digite a nova senha para {colaborador?.nome || 'este colaborador'}. 
                            A senha deve ter no mínimo 6 caracteres.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Digite a nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        confirmResetPassword();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setResetPasswordDialogOpen(false);
                                setNewPassword('');
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmResetPassword}
                            disabled={!newPassword || newPassword.length < 6}
                        >
                            Alterar Senha
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
