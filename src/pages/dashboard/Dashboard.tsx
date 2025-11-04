import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDashboard } from '@/data';
import { formatCurrency } from '@/utils/formatters';
import {
    FolderKanban,
    AlertCircle,
    FileText,
    DollarSign,
    TrendingUp,
    Calendar,
    Building2,
    BarChart3,
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Organograma } from '@/components/dashboard/Organograma';

export function Dashboard() {
    const navigate = useNavigate();
    const { estatisticas, projetosAndamento, projetosAtrasados, aniversariantes, pagamentosPendentes } = mockDashboard;

    const stats = [
        {
            title: 'Projetos Ativos',
            value: estatisticas.projetosAtivos,
            icon: FolderKanban,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Projetos Atrasados',
            value: estatisticas.projetosAtrasados,
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Propostas Pendentes',
            value: estatisticas.propostasPendentes,
            icon: FileText,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            title: 'Receita do Mês',
            value: formatCurrency(estatisticas.receitaMes),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Receita Prevista',
            value: formatCurrency(estatisticas.receitaPrevista),
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <div>
            <PageHeader
                title="Dashboard"
                description="Visão geral do escritório"
            />

            <Tabs defaultValue="resumo" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="resumo">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Resumo
                    </TabsTrigger>
                    <TabsTrigger value="organograma">
                        <Building2 className="mr-2 h-4 w-4" />
                        Organograma
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="resumo" className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        {stats.map((stat) => (
                            <Card key={stat.title} className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Projetos em Andamento */}
                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Projetos em Andamento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {projetosAndamento.slice(0, 5).map((projeto) => (
                                        <div
                                            key={projeto.id}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                                            onClick={() => navigate(`/projetos/${projeto.id}`)}
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{projeto.descricao}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {projeto.cliente.nome}
                                                </p>
                                            </div>
                                            <StatusBadge status={projeto.status} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Projetos Atrasados */}
                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    Projetos Atrasados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {projetosAtrasados.map((projeto) => (
                                        <div
                                            key={projeto.id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{projeto.numero}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {projeto.cliente}
                                                </p>
                                                <p className="text-xs text-red-600 mt-1">
                                                    {projeto.diasAtraso} dias de atraso - {projeto.etapaAtrasada}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aniversariantes */}
                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Aniversariantes do Mês
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {aniversariantes.map((aniversariante, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div>
                                                <p className="font-medium">{aniversariante.nome}</p>
                                                <p className="text-sm text-muted-foreground capitalize">
                                                    {aniversariante.tipo}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium">{aniversariante.data}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagamentos Pendentes */}
                        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Pagamentos Pendentes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {pagamentosPendentes.map((pagamento, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{pagamento.projeto}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {pagamento.cliente}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Vencimento: {pagamento.vencimento}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(pagamento.valor)}</p>
                                                {pagamento.diasAtraso > 0 && (
                                                    <p className="text-xs text-red-600">
                                                        {pagamento.diasAtraso} dias de atraso
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="organograma">
                    <Organograma />
                </TabsContent>
            </Tabs>
        </div>
    );
}
