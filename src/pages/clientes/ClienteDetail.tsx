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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Edit,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    MapPin,
    Building2,
    User,
    MessageSquare,
    FolderKanban,
    FileText,
    DollarSign,
    Loader2,
} from 'lucide-react';
import { getInitials, formatPhone, formatCPF, formatCNPJ, formatDate } from '@/utils/formatters';
import { clientesService, type Cliente } from '@/api/services/clientes.service';
import { toast } from 'sonner';

export function ClienteDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const data = await clientesService.getById(Number(id));
                setCliente(data);
            } catch (error: any) {
                console.error('Erro ao buscar cliente:', error);
                toast.error('Erro ao carregar dados do cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    if (loading) {
        return (
            <div>
                <PageHeader title="Carregando..." showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground mt-4">Carregando dados do cliente...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!cliente) {
        return (
            <div>
                <PageHeader title="Cliente não encontrado" showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            O cliente solicitado não foi encontrado.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Detalhes do Cliente"
                showBack
                action={
                    <Button onClick={() => navigate(`/clientes/${id}/editar`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                }
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Card Principal */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-3">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                                        {getInitials(cliente.nome)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex gap-2">
                                    {cliente.ativo ? (
                                        <Badge className="bg-green-500">Ativo</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inativo</Badge>
                                    )}
                                    <Badge
                                        variant="outline"
                                        className={cliente.tipo_pessoa === 'fisica' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}
                                    >
                                        {cliente.tipo_pessoa === 'fisica' ? (
                                            <><User className="mr-1 h-3 w-3" /> Física</>
                                        ) : (
                                            <><Building2 className="mr-1 h-3 w-3" /> Jurídica</>
                                        )}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{cliente.nome}</h2>
                                    {cliente.razao_social && (
                                        <p className="text-lg text-muted-foreground mt-1">
                                            {cliente.razao_social}
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{cliente.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Telefone</p>
                                            <p className="font-medium">{formatPhone(cliente.telefone)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {cliente.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                                            </p>
                                            <p className="font-medium">
                                                {cliente.tipo_pessoa === 'fisica'
                                                    ? formatCPF(cliente.cpf_cnpj)
                                                    : formatCNPJ(cliente.cpf_cnpj)}
                                            </p>
                                        </div>
                                    </div>

                                    {cliente.whatsapp && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">WhatsApp</p>
                                                <p className="font-medium">{formatPhone(cliente.whatsapp)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {cliente.data_nascimento && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                                <p className="font-medium">{formatDate(cliente.data_nascimento)}</p>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Endereço */}
                {(cliente.endereco || cliente.cidade) && (
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {cliente.endereco && (
                                <div>
                                    <p className="font-medium">{cliente.endereco}</p>
                                </div>
                            )}
                            {cliente.cidade && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Cidade/Estado</p>
                                    <p className="font-medium">
                                        {cliente.cidade}{cliente.estado && `, ${cliente.estado}`}
                                    </p>
                                </div>
                            )}
                            {cliente.cep && (
                                <div>
                                    <p className="text-sm text-muted-foreground">CEP</p>
                                    <p className="font-medium">{cliente.cep}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Informações Adicionais */}
                {cliente.tipo_pessoa === 'juridica' && (cliente.inscricao_estadual || cliente.inscricao_municipal) && (
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Pessoa Jurídica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cliente.inscricao_estadual && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Inscrição Estadual</p>
                                    <p className="font-medium">{cliente.inscricao_estadual}</p>
                                </div>
                            )}
                            {cliente.inscricao_municipal && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Inscrição Municipal</p>
                                        <p className="font-medium">{cliente.inscricao_municipal}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Observações */}
                {cliente.observacoes && (
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Observações
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{cliente.observacoes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Estatísticas */}
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5" />
                            Projetos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Projetos Ativos</p>
                                <p className="text-2xl font-bold">3</p>
                            </div>
                            <FolderKanban className="h-8 w-8 text-primary/50" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Projetos Concluídos</p>
                                <p className="text-2xl font-bold">8</p>
                            </div>
                            <FileText className="h-8 w-8 text-green-500/50" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor Total</p>
                                <p className="text-2xl font-bold text-green-600">R$ 245.000</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
