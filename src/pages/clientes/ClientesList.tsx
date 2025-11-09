import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SkeletonStatCard, SkeletonCard } from '@/components/common/SkeletonCard';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone, Edit, Trash2, MapPin, Building2, User, X } from 'lucide-react';
import { getInitials, formatPhone, formatCPF, formatCNPJ } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';
import { useClientes } from '@/hooks/useClientes';

export function ClientesList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState(''); // Busca ativa (após clicar em Buscar)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // ✅ Hook real do backend com paginação e busca
    const {
        clientes,
        total,
        loading,
        error,
        fetchClientes,
        deleteCliente,
    } = useClientes(
        {
            skip: (currentPage - 1) * pageSize,
            limit: pageSize,
            search: activeSearch || undefined // ✅ Usa busca ativa
        },
        true // autoFetch
    );

    // Função para realizar busca
    const handleSearch = () => {
        setActiveSearch(searchTerm);
        setCurrentPage(1); // Volta para primeira página
    };

    // Função para limpar busca
    const handleClearSearch = () => {
        setSearchTerm('');
        setActiveSearch('');
        setCurrentPage(1);
    };

    // Buscar ao pressionar Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Paginação do backend
    const totalPages = Math.ceil(total / pageSize);

    // Usa clientes diretamente do backend (busca já é feita lá)
    const displayClientes = clientes;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Hook recarrega automaticamente quando params mudam
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
        // Hook recarrega automaticamente quando params mudam
    };

    // Recarregar quando página ou tamanho mudar
    useEffect(() => {
        fetchClientes();
    }, [currentPage, pageSize]);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedId) return;

        try {
            await deleteCliente(selectedId);
            toast.success('Cliente excluído com sucesso!');
            setDeleteDialogOpen(false);
            setSelectedId(null);
        } catch (error) {
            toast.error('Erro ao excluir cliente');
        }
    };

    // Mostrar erro se houver
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (loading) {
        return (
            <div>
                <PageHeader
                    title="Clientes"
                    description="Gerencie os clientes do escritório"
                />
                <div className="grid gap-6 md:grid-cols-4 mb-6">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
                <SkeletonCard hasHeader={false} lines={1} className="mb-6" />
                <SkeletonCard>
                    <SkeletonTable columns={6} rows={5} />
                </SkeletonCard>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Clientes"
                description="Gerencie os clientes do escritório"
                action={
                    <Button onClick={() => navigate('/clientes/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Cliente
                    </Button>
                }
            />

            <Card className="mb-6 backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar por nome, email, CPF/CNPJ ou cidade..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-9"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="shrink-0"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar
                        </Button>
                        <Button
                            onClick={handleClearSearch}
                            variant="outline"
                            disabled={loading || (!searchTerm && !activeSearch)}
                            className="shrink-0"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>
                        {total} Cliente(s)
                        {activeSearch && (
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                (buscando por "{activeSearch}")
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Mostrando {clientes.length} de {total} clientes (Página {currentPage} de {totalPages})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayClientes.map((cliente) => (
                                <TableRow
                                    key={cliente.id}
                                    className="cursor-pointer hover:bg-accent/50"
                                    onClick={() => navigate(`/clientes/${cliente.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(cliente.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{cliente.nome}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {cliente.tipo_pessoa === 'Física'
                                                        ? formatCPF(cliente.identificacao)
                                                        : formatCNPJ(cliente.identificacao)}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {cliente.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {formatPhone(cliente.telefone)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {cliente.cidade || 'N/A'}, {cliente.uf || ''}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cliente.tipo_pessoa === 'Física' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}
                                        >
                                            {cliente.tipo_pessoa === 'Física' ? (
                                                <><User className="mr-1 h-3 w-3" /> Física</>
                                            ) : (
                                                <><Building2 className="mr-1 h-3 w-3" /> Jurídica</>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {cliente.ativo ? (
                                            <Badge className="bg-green-500">Ativo</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inativo</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/clientes/${cliente.id}/editar`);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(cliente.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {displayClientes.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Nenhum cliente encontrado com esse termo' : 'Nenhum cliente cadastrado'}
                            </p>
                        </div>
                    )}

                    {total > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={total}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Cliente"
                description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />
        </div>
    );
}
