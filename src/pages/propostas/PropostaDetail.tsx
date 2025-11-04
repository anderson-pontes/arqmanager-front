import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Edit, DollarSign, Calendar, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { mockPropostas } from '@/data';
import { getInitials, formatCurrency, formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

export function PropostaDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);
    const proposta = mockPropostas.find((p) => p.id === Number(id));

    if (!proposta) {
        return (
            <div>
                <PageHeader title="Proposta não encontrada" showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">A proposta solicitada não foi encontrada.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const confirmConvert = () => {
        toast.success('Proposta convertida em projeto com sucesso!');
        setConvertDialogOpen(false);
        navigate('/projetos');
    };

    return (
        <div>
            <PageHeader
                title={`Proposta ${proposta.numero}`}
                description={proposta.identificacao}
                showBack
                action={
                    <div className="flex gap-2">
                        {proposta.status === 'Aprovada' && (
                            <Button onClick={() => setConvertDialogOpen(true)}>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Converter em Projeto
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => navigate(`/propostas/${id}/editar`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </div>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor da Proposta</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(proposta.valorProposta)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Parcela: {formatCurrency(proposta.valorParcelaAprazo)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Data da Proposta</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{formatDate(proposta.dataProposta)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ano: {proposta.ano}</p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-orange-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <FileText className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <Badge className="text-sm">{proposta.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-2">{proposta.etapas.length} etapas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Informações Principais */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Informações do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                    {getInitials(proposta.cliente.nome)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{proposta.cliente.nome}</p>
                                <p className="text-sm text-muted-foreground">{proposta.cliente.email}</p>
                                <p className="text-sm text-muted-foreground">{proposta.cliente.telefone}</p>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">Endereço</p>
                            <p className="text-sm">
                                {proposta.cliente.endereco.logradouro}, {proposta.cliente.endereco.numero}
                            </p>
                            <p className="text-sm">
                                {proposta.cliente.endereco.cidade} - {proposta.cliente.endereco.uf}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Detalhes da Proposta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Serviço</p>
                            <p className="font-medium text-lg">{proposta.servico.nome}</p>
                            <p className="text-sm text-muted-foreground mt-1">{proposta.servico.descricao}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">Descrição</p>
                            <p className="text-sm">{proposta.descricao}</p>
                        </div>
                        {proposta.observacao && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Observações</p>
                                    <p className="text-sm">{proposta.observacao}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Etapas */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>Etapas da Proposta</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {proposta.etapas.map((etapa, index) => (
                            <div key={etapa.id || index} className="flex items-start gap-4 p-4 border rounded-lg">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{etapa.etapa.nome}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{etapa.etapa.descricao}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span>Prazo: {etapa.prazo} dias</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                                            <span>Previsão: {formatDate(etapa.dataPrevista)}</span>
                                        </div>
                                    </div>
                                    {etapa.descricao && (
                                        <p className="text-sm text-muted-foreground mt-2 italic">{etapa.descricao}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={convertDialogOpen}
                onOpenChange={setConvertDialogOpen}
                onConfirm={confirmConvert}
                title="Converter em Projeto"
                description={`Tem certeza que deseja converter a proposta ${proposta.numero} em projeto? Um novo projeto será criado com base nos dados desta proposta.`}
                confirmText="Converter em Projeto"
            />
        </div>
    );
}
