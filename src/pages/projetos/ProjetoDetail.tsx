import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Users, DollarSign, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { mockProjetos } from '@/data';
import { getInitials, formatCurrency, formatDate } from '@/utils/formatters';

export function ProjetoDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const projeto = mockProjetos.find((p) => p.id === Number(id));

    if (!projeto) {
        return (
            <div>
                <PageHeader title="Projeto não encontrado" showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">O projeto solicitado não foi encontrado.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const progresso = Math.round((projeto.etapas.filter((e) => e.status === 'Concluída').length / projeto.etapas.length) * 100);

    return (
        <div>
            <PageHeader
                title={`Projeto ${projeto.numero}`}
                description={projeto.descricao}
                showBack
                action={
                    <Button onClick={() => navigate(`/projetos/${id}/editar`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                }
            />

            {/* Resumo do Projeto */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Contrato</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(projeto.valorContrato)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Saldo: {formatCurrency(projeto.saldoContrato)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{progresso}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {projeto.etapas.filter((e) => e.status === 'Concluída').length} de {projeto.etapas.length} etapas
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-orange-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prazo</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold">{formatDate(projeto.dataPrevisaoFim)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Início: {formatDate(projeto.dataInicio)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Equipe</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{projeto.equipe.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Colaboradores</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="geral" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="etapas">Etapas</TabsTrigger>
                    <TabsTrigger value="equipe">Equipe</TabsTrigger>
                    <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
                    <TabsTrigger value="documentos">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="geral">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Informações do Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {getInitials(projeto.cliente.nome)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{projeto.cliente.nome}</p>
                                        <p className="text-sm text-muted-foreground">{projeto.cliente.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Detalhes do Projeto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Serviço</p>
                                    <p className="font-medium">{projeto.servico.nome}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge>{projeto.status}</Badge>
                                </div>
                                {projeto.metragem && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Metragem</p>
                                        <p className="font-medium">{projeto.metragem} m²</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="etapas">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Etapas do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {projeto.etapas.map((etapa) => (
                                    <div key={etapa.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {etapa.status === 'Concluída' ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-blue-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">{etapa.etapa}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Prazo: {etapa.prazo} dias - Previsão: {formatDate(etapa.dataPrevista)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={etapa.status === 'Concluída' ? 'default' : 'secondary'}>
                                            {etapa.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="equipe">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Equipe do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {projeto.equipe.map((membro) => (
                                    <div key={membro.id} className="flex items-center gap-3 p-4 border rounded-lg">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {getInitials(membro.nome)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{membro.nome}</p>
                                            <p className="text-sm text-muted-foreground">{membro.perfil}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pagamentos">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Pagamentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {projeto.pagamentos.map((pag) => (
                                    <div key={pag.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{pag.descricao}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Previsão: {formatDate(pag.dataPrevisao)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">{formatCurrency(pag.valor)}</p>
                                            <Badge variant={pag.status === 'Pago' ? 'default' : 'secondary'}>
                                                {pag.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documentos">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Documentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {projeto.documentos.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{doc.nome}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {doc.tipo} - {doc.tamanho} - {formatDate(doc.dataUpload)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Download</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
