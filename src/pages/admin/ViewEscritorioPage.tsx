import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { adminService } from '@/api/services/admin.service';
import type { Escritorio } from '@/types';
import { Building2, Mail, Phone, MapPin, Calendar, Palette, ArrowLeft, Loader2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { formatCNPJ, formatCPF, formatPhone, formatCEP } from '@/utils/formatters';

export function ViewEscritorioPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [escritorio, setEscritorio] = useState<Escritorio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEscritorio = async () => {
            if (!id) {
                toast.error('ID do escritório não fornecido');
                navigate('/admin');
                return;
            }

            try {
                setLoading(true);
                const data = await adminService.getEscritorio(parseInt(id));
                setEscritorio(data);
            } catch (error: any) {
                toast.error('Erro ao carregar escritório', {
                    description: error.response?.data?.detail || error.message,
                });
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        loadEscritorio();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!escritorio) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Escritório não encontrado</CardTitle>
                        <CardDescription>
                            O escritório solicitado não foi encontrado ou foi removido.
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
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: escritorio.cor }}
                        />
                        <div>
                            <h1 className="text-3xl font-bold">{escritorio.nomeFantasia}</h1>
                            <p className="text-muted-foreground text-lg mt-1">
                                {escritorio.razaoSocial}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => navigate(`/admin/escritorios/${escritorio.id}/editar`)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Escritório
                </Button>
            </div>

            {/* Status */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Badge variant={escritorio.ativo ? 'default' : 'secondary'}>
                            {escritorio.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {escritorio.created_at && (
                            <span className="text-sm text-muted-foreground">
                                Criado em {format(new Date(escritorio.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informações Básicas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Informações Básicas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {escritorio.documento && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                                <p className="text-base font-medium">
                                    {formatCNPJ(escritorio.documento) !== '-' ? formatCNPJ(escritorio.documento) : escritorio.documento}
                                </p>
                            </div>
                        )}
                        {escritorio.cpf && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                                <p className="text-base font-medium">
                                    {formatCPF(escritorio.cpf) !== '-' ? formatCPF(escritorio.cpf) : escritorio.cpf}
                                </p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </p>
                            <p className="text-base font-medium">{escritorio.email}</p>
                        </div>
                        {escritorio.telefone && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Telefone
                                </p>
                                <p className="text-base font-medium">{formatPhone(escritorio.telefone)}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Cor
                            </p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded border-2 border-border"
                                    style={{ backgroundColor: escritorio.cor }}
                                />
                                <p className="text-base font-medium">{escritorio.cor}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Endereço */}
            {(escritorio.logradouro || escritorio.cep || escritorio.endereco) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Endereço
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {escritorio.logradouro || escritorio.cep ? (
                            <div className="space-y-3">
                                {escritorio.logradouro && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
                                        <p className="text-base">
                                            {escritorio.logradouro}
                                            {escritorio.numero && `, ${escritorio.numero}`}
                                            {escritorio.complemento && ` - ${escritorio.complemento}`}
                                        </p>
                                    </div>
                                )}
                                {escritorio.bairro && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                                        <p className="text-base">{escritorio.bairro}</p>
                                    </div>
                                )}
                                {(escritorio.cidade || escritorio.uf) && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Cidade/UF</p>
                                        <p className="text-base">
                                            {escritorio.cidade}
                                            {escritorio.uf && ` - ${escritorio.uf}`}
                                        </p>
                                    </div>
                                )}
                                {escritorio.cep && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">CEP</p>
                                        <p className="text-base">
                                            {formatCEP(escritorio.cep) || escritorio.cep}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : escritorio.endereco ? (
                            <p className="text-base">{escritorio.endereco}</p>
                        ) : null}
                    </CardContent>
                </Card>
            )}

            {/* Datas */}
            {escritorio.created_at && (
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
                                    {format(new Date(escritorio.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                            </div>
                            {escritorio.updated_at && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                                    <p className="text-base font-medium">
                                        {format(new Date(escritorio.updated_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
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

