import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { adminService } from '@/api/services/admin.service';
import type { User, Escritorio } from '@/types';
import { UserCog, Mail, Phone, Calendar, Building2, ArrowLeft, Loader2, CreditCard, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '@/utils/formatters';

interface EscritorioAdminDetails extends User {
    cpf?: string | null;
    telefone?: string | null;
    dataNascimento?: string | null;
    tipo?: string;
    ativo?: boolean;
    ultimoAcesso?: string | null;
    tipoPix?: string | null;
    chavePix?: string | null;
    foto?: string | null;
    created_at?: string;
    updated_at?: string;
    escritorio?: Escritorio;
}

export function ViewEscritorioAdminPage() {
    const { escritorioId, id } = useParams<{ escritorioId: string; id: string }>();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<EscritorioAdminDetails | null>(null);
    const [escritorio, setEscritorio] = useState<Escritorio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdmin = async () => {
            if (!id || !escritorioId) {
                toast.error('ID do administrador ou escritório não fornecido');
                navigate('/admin');
                return;
            }

            try {
                setLoading(true);
                
                // Carregar escritório
                const escritorioData = await adminService.getEscritorio(parseInt(escritorioId));
                setEscritorio(escritorioData);
                
                // Buscar da lista de admins do escritório
                const admins = await adminService.listEscritorioAdmins(parseInt(escritorioId), { limit: 1000 });
                const foundAdmin = admins.find(a => a.id === parseInt(id));
                
                if (!foundAdmin) {
                    toast.error('Administrador não encontrado');
                    navigate('/admin');
                    return;
                }
                
                // Converter snake_case para camelCase se necessário
                const adminData: EscritorioAdminDetails = {
                    ...foundAdmin,
                    cpf: (foundAdmin as any).cpf || null,
                    telefone: (foundAdmin as any).telefone || null,
                    dataNascimento: (foundAdmin as any).data_nascimento || (foundAdmin as any).dataNascimento || null,
                    tipo: (foundAdmin as any).tipo || null,
                    ativo: (foundAdmin as any).ativo !== undefined ? (foundAdmin as any).ativo : true,
                    ultimoAcesso: (foundAdmin as any).ultimo_acesso || (foundAdmin as any).ultimoAcesso || null,
                    tipoPix: (foundAdmin as any).tipo_pix || (foundAdmin as any).tipoPix || null,
                    chavePix: (foundAdmin as any).chave_pix || (foundAdmin as any).chavePix || null,
                    foto: (foundAdmin as any).foto || null,
                    created_at: (foundAdmin as any).created_at || null,
                    updated_at: (foundAdmin as any).updated_at || null,
                    escritorio: escritorioData,
                };
                
                setAdmin(adminData);
            } catch (error: any) {
                toast.error('Erro ao carregar administrador', {
                    description: error.response?.data?.detail || error.message,
                });
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, [id, escritorioId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Administrador não encontrado</CardTitle>
                        <CardDescription>
                            O administrador solicitado não foi encontrado ou foi removido.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/admin')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para Administração
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/admin')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {admin.foto ? (
                                <img 
                                    src={admin.foto} 
                                    alt={admin.nome}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <UserIcon className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{admin.nome}</h1>
                            <p className="text-muted-foreground text-lg mt-1">
                                Administrador do Escritório
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Badge variant={admin.ativo !== false ? 'default' : 'secondary'}>
                            {admin.ativo !== false ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {escritorio?.nomeFantasia || 'Escritório'}
                        </Badge>
                        {admin.created_at && (
                            <span className="text-sm text-muted-foreground">
                                Criado em {format(new Date(admin.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informações do Escritório */}
            {escritorio && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Escritório Vinculado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nome Fantasia</p>
                                <p className="text-base font-medium">{escritorio.nomeFantasia}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
                                <p className="text-base font-medium">{escritorio.razaoSocial}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Informações Básicas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Informações Pessoais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </p>
                            <p className="text-base font-medium">{admin.email}</p>
                        </div>
                        {admin.cpf && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                                <p className="text-base font-medium">
                                    {formatCPF(admin.cpf) !== '-' ? formatCPF(admin.cpf) : admin.cpf}
                                </p>
                            </div>
                        )}
                        {admin.telefone && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Telefone
                                </p>
                                <p className="text-base font-medium">{formatPhone(admin.telefone)}</p>
                            </div>
                        )}
                        {admin.dataNascimento && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Data de Nascimento
                                </p>
                                <p className="text-base font-medium">
                                    {format(new Date(admin.dataNascimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                            </div>
                        )}
                        {admin.tipo && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                                <p className="text-base font-medium">{admin.tipo}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informações de Acesso */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Informações de Acesso
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Perfil</p>
                            <Badge variant="outline">{admin.perfil}</Badge>
                        </div>
                        {admin.ultimoAcesso && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Último Acesso</p>
                                <p className="text-base font-medium">
                                    {format(new Date(admin.ultimoAcesso), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informações PIX */}
            {(admin.tipoPix || admin.chavePix) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Informações PIX
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {admin.tipoPix && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Tipo PIX</p>
                                    <p className="text-base font-medium">{admin.tipoPix}</p>
                                </div>
                            )}
                            {admin.chavePix && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Chave PIX</p>
                                    <p className="text-base font-medium font-mono">{admin.chavePix}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Datas */}
            {admin.created_at && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Datas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                                <p className="text-base font-medium">
                                    {format(new Date(admin.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                            </div>
                            {admin.updated_at && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                                    <p className="text-base font-medium">
                                        {format(new Date(admin.updated_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Botão Voltar */}
            <div className="flex justify-end">
                <Button onClick={() => navigate('/admin')} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Administração
                </Button>
            </div>
        </div>
    );
}

