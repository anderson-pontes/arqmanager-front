import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Edit,
    Plus,
    TrendingUp,
    TrendingDown,
    ArrowRightLeft,
    Wallet,
    Calendar,
    FileBarChart,
    Receipt,
} from 'lucide-react';
import { mockContasBancarias, mockMovimentacoes } from '@/data';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Pagination } from '@/components/common/Pagination';

export function ContaDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const conta = mockContasBancarias.find((c) => c.id === Number(id));

    if (!conta) {
        return (
            <div>
                <PageHeader title="Conta não encontrada" showBack />
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">A conta solicitada não foi encontrada.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filtrar movimentações desta conta
    const movimentacoesConta = mockMovimentacoes.filter(
        (m) => m.conta.id === conta.id || m.contaDestino?.id === conta.id
    );

    const totalReceitas = movimentacoesConta
        .filter((m) => m.tipo === 'Receita' && m.status === 'Pago')
        .reduce((acc, m) => acc + m.valor, 0);

    const totalDespesas = movimentacoesConta
        .filter((m) => m.tipo === 'Despesa' && m.status === 'Pago')
        .reduce((acc, m) => acc + m.valor, 0);

    const totalPages = Math.ceil(movimentacoesConta.length / pageSize);
    const paginatedMovimentacoes = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return movimentacoesConta.slice(startIndex, startIndex + pageSize);
    }, [movimentacoesConta, currentPage, pageSize]);

    const getIconByTipo = (tipo: string) => {
        if (tipo === 'Receita') return <TrendingUp className="h-4 w-4 text-green-600" />;
        if (tipo === 'Despesa') return <TrendingDown className="h-4 w-4 text-red-600" />;
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
    };

    return (
        <div>
            <PageHeader
                title={conta.nome}
                description={`${conta.banco} - ${conta.tipo}`}
                showBack
                action={
                    <Button onClick={() => navigate(`/financeiro/contas/${id}/editar`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Conta
                    </Button>
                }
            />

            {/* Informações da Conta */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(conta.saldoAtual)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Inicial: {formatCurrency(conta.saldoInicial)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-red-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={conta.ativo ? 'default' : 'secondary'} className="text-sm">
                            {conta.ativo ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                            {conta.agencia} / {conta.conta}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Funcionalidades */}
            <Tabs defaultValue="movimentacoes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="movimentacoes">
                        <Receipt className="mr-2 h-4 w-4" />
                        Movimentações
                    </TabsTrigger>
                    <TabsTrigger value="receitas">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Receitas
                    </TabsTrigger>
                    <TabsTrigger value="despesas">
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Despesas
                    </TabsTrigger>
                    <TabsTrigger value="transferencias">
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Transferências
                    </TabsTrigger>
                    <TabsTrigger value="relatorios">
                        <FileBarChart className="mr-2 h-4 w-4" />
                        Relatórios
                    </TabsTrigger>
                </TabsList>

                {/* Movimentações */}
                <TabsContent value="movimentacoes">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Todas as Movimentações</CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nova Receita
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nova Despesa
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedMovimentacoes.map((mov) => (
                                        <TableRow key={mov.id}>
                                            <TableCell>{formatDate(mov.data)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getIconByTipo(mov.tipo)}
                                                    <span>{mov.descricao}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    style={{ borderColor: mov.categoria.cor, color: mov.categoria.cor }}
                                                >
                                                    {mov.categoria.nome}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={
                                                        mov.tipo === 'Receita'
                                                            ? 'text-green-600 font-semibold'
                                                            : 'text-red-600 font-semibold'
                                                    }
                                                >
                                                    {mov.tipo === 'Receita' ? '+' : '-'} {formatCurrency(mov.valor)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={mov.status === 'Pago' ? 'default' : 'secondary'}>
                                                    {mov.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {movimentacoesConta.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    totalItems={movimentacoesConta.length}
                                    onPageChange={setCurrentPage}
                                    onPageSizeChange={(size) => {
                                        setPageSize(size);
                                        setCurrentPage(1);
                                    }}
                                />
                            )}

                            {movimentacoesConta.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Receitas */}
                <TabsContent value="receitas">
                    <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Receitas</CardTitle>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Receita
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Filtro de receitas desta conta</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Despesas */}
                <TabsContent value="despesas">
                    <Card className="backdrop-blur-sm bg-white/80 border-red-100 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Despesas</CardTitle>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Despesa
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Filtro de despesas desta conta</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Transferências */}
                <TabsContent value="transferencias">
                    <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Transferências</CardTitle>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Transferência
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Transferências envolvendo esta conta</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Relatórios */}
                <TabsContent value="relatorios">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                        <CardHeader>
                            <CardTitle>Relatórios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Button variant="outline" className="h-24 flex-col">
                                    <Calendar className="h-6 w-6 mb-2" />
                                    <span>Relatório Mensal</span>
                                </Button>
                                <Button variant="outline" className="h-24 flex-col">
                                    <FileBarChart className="h-6 w-6 mb-2" />
                                    <span>Fluxo de Caixa</span>
                                </Button>
                                <Button variant="outline" className="h-24 flex-col">
                                    <Receipt className="h-6 w-6 mb-2" />
                                    <span>Extrato Completo</span>
                                </Button>
                                <Button variant="outline" className="h-24 flex-col">
                                    <TrendingUp className="h-6 w-6 mb-2" />
                                    <span>Análise de Receitas</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
