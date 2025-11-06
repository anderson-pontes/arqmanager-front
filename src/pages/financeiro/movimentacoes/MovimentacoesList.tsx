import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { mockMovimentacoes } from '@/data';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Pagination } from '@/components/common/Pagination';

export function MovimentacoesList() {
    const navigate = useNavigate();
    const [movimentacoes] = useState(mockMovimentacoes);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalReceitas = movimentacoes.filter((m) => m.tipo === 'Receita' && m.status === 'Pago').reduce((acc, m) => acc + m.valor, 0);
    const totalDespesas = movimentacoes.filter((m) => m.tipo === 'Despesa' && m.status === 'Pago').reduce((acc, m) => acc + m.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    const totalPages = Math.ceil(movimentacoes.length / pageSize);
    const paginatedMovimentacoes = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return movimentacoes.slice(startIndex, startIndex + pageSize);
    }, [movimentacoes, currentPage, pageSize]);

    const getIconByTipo = (tipo: string) => {
        if (tipo === 'Receita') return <TrendingUp className="h-4 w-4 text-green-600" />;
        if (tipo === 'Despesa') return <TrendingDown className="h-4 w-4 text-red-600" />;
        return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
    };

    return (
        <div>
            <PageHeader
                title="Movimentações"
                description="Gerencie receitas, despesas e transferências"
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                console.log('Navegando para receitas/novo');
                                navigate('/financeiro/receitas/novo');
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Receita
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/financeiro/despesas/novo')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Despesa
                        </Button>
                        <Button onClick={() => navigate('/financeiro/transferencias/novo')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Transferência
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 md:grid-cols-3 mb-6">
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
                        <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(saldo)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Conta</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedMovimentacoes.map((mov) => (
                                <TableRow key={mov.id} className="cursor-pointer hover:bg-accent/50">
                                    <TableCell>{formatDate(mov.data)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getIconByTipo(mov.tipo)}
                                            <span>{mov.descricao}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {mov.tipo === 'Receita' && mov.tipoReceita ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {mov.tipoReceita}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">{mov.tipo}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" style={{ borderColor: mov.categoria.cor, color: mov.categoria.cor }}>
                                            {mov.categoria.nome}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{mov.conta.nome}</TableCell>
                                    <TableCell>
                                        <span className={mov.tipo === 'Receita' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
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

                    {movimentacoes.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={movimentacoes.length}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
