import { useState } from 'react';
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
import { mockColaboradores } from '@/data';
import { getInitials, formatPhone, formatCPF, formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

export function ColaboradorDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

    const colaborador = mockColaboradores.find((c) => c.id === Number(id));

    const handleResetPassword = () => {
        setResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        try {
            // TODO: Implementar chamada à API para resetar senha
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Senha resetada com sucesso! Um email foi enviado para o colaborador.');
            setResetPasswordDialogOpen(false);
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            toast.error('Erro ao resetar senha');
        }
    };

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
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline">
                                            {colaborador.perfil}
                                        </Badge>
                                        {colaborador.tipo && (
                                            <Badge
                                                className={
                                                    colaborador.tipo === 'Geral'
                                                        ? 'bg-blue-500'
                                                        : 'bg-orange-500'
                                                }
                                            >
                                                {colaborador.tipo}
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
                                                {formatPhone(colaborador.telefone)}
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
                                                {formatDate(colaborador.dataNascimento)}
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
                        <div>
                            <p className="text-sm text-muted-foreground">Sócio</p>
                            <Badge variant={colaborador.socio === 'sim' ? 'default' : 'secondary'}>
                                {colaborador.socio === 'sim' ? 'Sim' : 'Não'}
                            </Badge>
                        </div>
                        {colaborador.tipoPix && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo PIX</p>
                                    <p className="font-medium capitalize">
                                        {colaborador.tipoPix === 'aleatoria' ? 'Chave Aleatória' : colaborador.tipoPix}
                                    </p>
                                </div>
                            </>
                        )}
                        {colaborador.chavePix && (
                            <div>
                                <p className="text-sm text-muted-foreground">Chave PIX</p>
                                <p className="font-medium">{colaborador.chavePix}</p>
                            </div>
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
                        {colaborador.tipo && (
                            <>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                    <Badge
                                        className={
                                            colaborador.tipo === 'Geral'
                                                ? 'bg-blue-500 mt-1'
                                                : 'bg-orange-500 mt-1'
                                        }
                                    >
                                        {colaborador.tipo}
                                    </Badge>
                                </div>
                                <Separator />
                            </>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Perfil de Acesso</p>
                            <Badge variant="outline" className="mt-1">
                                {colaborador.perfil}
                            </Badge>
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
                        {colaborador.ultimoAcesso && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Último Acesso
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(colaborador.ultimoAcesso)}
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

            {/* Dialog de Confirmação para Resetar Senha */}
            <ConfirmDialog
                open={resetPasswordDialogOpen}
                onOpenChange={setResetPasswordDialogOpen}
                onConfirm={confirmResetPassword}
                title="Resetar Senha"
                description={`Tem certeza que deseja resetar a senha de ${colaborador.nome}? Um email será enviado com as instruções para criar uma nova senha.`}
                confirmText="Resetar Senha"
            />
        </div>
    );
}
