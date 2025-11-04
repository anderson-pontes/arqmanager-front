import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Edit, Trash2, Eye, FileText, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { mockPropostas } from '@/data';
import { getInitials, formatCurrency, formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';

export function PropostasList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [propostas] = useState(mockPropostas);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [convertDialogOpen, setConvertDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredPropostas = useMemo(() => {
        return propostas.filter(
            (proposta) =>
                proposta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposta.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposta.identificacao.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [propostas, searchTerm]);

    const totalPages = Math.ceil(filteredPropostas.length / pageSize);
    const paginatedPropostas = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredPropostas.slice(startIndex, startIndex + pageSize);
    }, [filteredPropostas, currentPage, pageSize]);

    const propostasAguardando = propostas.filter((p) => p.status === 'Aguardando').length;
    const propostasAprovadas = propostas.filter((p) => p.status === 'Aprovada').length;
    const propostasRecusadas = propostas.filter((p) => p.status === 'Recusada').length;
    const valorTotal = propostas.reduce((acc, p) => acc + p.valorProposta, 0);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const handleConvert = (id: number) => {
        setSelectedId(id);
        setConvertDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success('Proposta excluída com sucesso!');
        setDeleteDialogOpen(false);
    };

    const confirmConvert = () => {
        toast.success('Proposta convertida em projeto com sucesso!');
        setConvertDialogOpen(false);
        navigate('/projetos');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aguardando':
                return 'bg-yellow-500';
            case 'Aprovada':
                return 'bg-green-500';
            case 'Recusada':
                return 'bg-red-500';
            case 'Arquivada':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Aguardando':
                return <Clock className="h-4 w-4" />;
            case 'Aprovada':
                return <CheckCircle className="h-4 w-4" />;
            case 'Recusada':
                return <XCircle className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div>
            <PageHeader
                title="Propostas"
                description="Gerencie as propostas comerciais"
                action={
                    <Button onClick={() => navigate('/propostas/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Proposta
                    </Button>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-yellow-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{propostasAguardando}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{propostasAprovadas}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-red-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recusadas</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{propostasRecusadas}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                        <FileText className="h-4 w-4 text-purple-600" />
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
                            placeholder="Buscar por número, cliente ou identificação..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Propostas */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>{filteredPropostas.length} Proposta(s)</CardTitle>
                    <CardDescription>Lista de todas as propostas cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Proposta</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPropostas.map((proposta) => (
                                <TableRow
                                    key={proposta.id}
                                    className="cursor-pointer hover:bg-accent/50"
                                    onClick={() => navigate(`/propostas/${proposta.id}`)}
                                >
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{proposta.numero}</p>
                                            <p className="text-sm text-muted-foreground">{proposta.identificacao}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {getInitials(proposta.cliente.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{proposta.cliente.nome}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{proposta.servico.nome}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold">{formatCurrency(proposta.valorProposta)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{formatDate(proposta.dataProposta)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(proposta.status) + ' text-white border-0'}>
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(proposta.status)}
                                                {proposta.status}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {proposta.status === 'Aprovada' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleConvert(proposta.id);
                                                    }}
                                                    title="Converter em Projeto"
                                                >
                                                    <ArrowRight className="h-4 w-4 text-green-600" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/propostas/${proposta.id}`);
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
                                                    navigate(`/propostas/${proposta.id}/editar`);
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
                                                    handleDelete(proposta.id);
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

                    {filteredPropostas.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Nenhuma proposta encontrada</p>
                        </div>
                    )}

                    {filteredPropostas.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredPropostas.length}
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
                title="Excluir Proposta"
                description="Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />

            <ConfirmDialog
                open={convertDialogOpen}
                onOpenChange={setConvertDialogOpen}
                onConfirm={confirmConvert}
                title="Converter em Projeto"
                description="Tem certeza que deseja converter esta proposta em projeto? Um novo projeto será criado com base nos dados da proposta."
                confirmText="Converter"
            />
        </div>
    );
}
