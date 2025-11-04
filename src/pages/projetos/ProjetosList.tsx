import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoading } from '@/hooks/useLoading';
import { SkeletonStatCard, SkeletonCard } from '@/components/common/SkeletonCard';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockProjetos } from '@/data';
import { getInitials, formatCurrency, formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';

export function ProjetosList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [projetos] = useState(mockProjetos);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const isLoading = useLoading(800);

    const filteredProjetos = useMemo(() => {
        return projetos.filter(
            (projeto) =>
                projeto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                projeto.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                projeto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projetos, searchTerm]);

    const totalPages = Math.ceil(filteredProjetos.length / pageSize);
    const paginatedProjetos = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredProjetos.slice(startIndex, startIndex + pageSize);
    }, [filteredProjetos, currentPage, pageSize]);

    const projetosAtivos = projetos.filter((p) => p.status === 'Em Andamento').length;
    const projetosConcluidos = projetos.filter((p) => p.status === 'Concluído').length;
    const valorTotal = projetos.reduce((acc, p) => acc + p.valorContrato, 0);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success('Projeto excluído com sucesso!');
        setDeleteDialogOpen(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em Andamento':
                return 'bg-blue-500';
            case 'Concluído':
                return 'bg-green-500';
            case 'Pausado':
                return 'bg-yellow-500';
            case 'Cancelado':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Em Andamento':
                return <Clock className="h-4 w-4" />;
            case 'Concluído':
                return <CheckCircle className="h-4 w-4" />;
            case 'Pausado':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageHeader title="Projetos" description="Gerencie os projetos do escritório" />
                <div className="grid gap-6 md:grid-cols-4 mb-6">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
                <SkeletonCard hasHeader={false} lines={1} className="mb-6" />
                <SkeletonCard>
                    <SkeletonTable columns={7} rows={5} />
                </SkeletonCard>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Projetos"
                description="Gerencie os projetos do escritório"
                action={
                    <Button onClick={() => navigate('/projetos/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Projeto
                    </Button>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projetos.length}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{projetosAtivos}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{projetosConcluidos}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(valorTotal)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Busca */}
            <Card className="mb-6 backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por número, cliente ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Projetos */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>{filteredProjetos.length} Projeto(s)</CardTitle>
                    <CardDescription>Lista de todos os projetos cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Prazo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProjetos.map((projeto) => (
                                <TableRow
                                    key={projeto.id}
                                    className="cursor-pointer hover:bg-accent/50"
                                    onClick={() => navigate(`/projetos/${projeto.id}`)}
                                >
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{projeto.numero}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                {projeto.descricao}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {getInitials(projeto.cliente.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{projeto.cliente.nome}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{projeto.servico.nome}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(projeto.status) + ' text-white border-0'}>
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(projeto.status)}
                                                {projeto.status}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold">{formatCurrency(projeto.valorContrato)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p>{formatDate(projeto.dataPrevisaoFim)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/projetos/${projeto.id}`);
                                                }}
                                                title="Ver Detalhes"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/projetos/${projeto.id}/editar`);
                                                }}
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(projeto.id);
                                                }}
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredProjetos.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Nenhum projeto encontrado</p>
                        </div>
                    )}

                    {filteredProjetos.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredProjetos.length}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Projeto"
                description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />
        </div>
    );
}
