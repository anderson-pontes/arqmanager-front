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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone, Edit, Trash2, MapPin, Building2, User, X, Loader2 } from 'lucide-react';
import { getInitials, formatPhone, formatCPF, formatCNPJ } from '@/utils/formatters';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';
import { useClientes } from '@/hooks/useClientes';

export function ClientesList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState(''); // Busca ativa (após clicar em Buscar)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedClienteName, setSelectedClienteName] = useState<string>('');
    const [permanentDelete, setPermanentDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
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

    const handleDelete = (id: number, nome: string) => {
        setSelectedId(id);
        setSelectedClienteName(nome);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedId) return;

        setDeleting(true);
        try {
            await deleteCliente(selectedId, permanentDelete);
            const message = permanentDelete
                ? 'Cliente excluído permanentemente!'
                : 'Cliente desativado com sucesso!';
            toast.success(message);
            setDeleteDialogOpen(false);
            setSelectedId(null);
            setSelectedClienteName('');
            setPermanentDelete(false);
            // Recarregar a lista
            fetchClientes();
        } catch (error) {
            toast.error('Erro ao excluir cliente');
        } finally {
            setDeleting(false);
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
                                                    {cliente.tipo_pessoa === 'fisica'
                                                        ? formatCPF(cliente.cpf_cnpj)
                                                        : formatCNPJ(cliente.cpf_cnpj)}
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
                                            className={cliente.tipo_pessoa === 'fisica' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}
                                        >
                                            {cliente.tipo_pessoa === 'fisica' ? (
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
                                                    handleDelete(cliente.id, cliente.nome);
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

            {/* Modal de Confirmação de Exclusão */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja {permanentDelete ? 'excluir permanentemente' : 'desativar'} o cliente <strong>{selectedClienteName}</strong>?
                            <br />
                            <br />
                            {permanentDelete ? (
                                <span className="text-destructive font-semibold">
                                    ⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL! O cliente será removido permanentemente do banco de dados.
                                </span>
                            ) : (
                                <span>
                                    O cliente será marcado como inativo e não aparecerá mais nas listagens. Você poderá reativá-lo posteriormente.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex items-center space-x-2 px-6 py-4">
                        <Checkbox
                            id="permanent-list"
                            checked={permanentDelete}
                            onCheckedChange={(checked) => setPermanentDelete(checked as boolean)}
                            disabled={deleting}
                        />
                        <Label
                            htmlFor="permanent-list"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Excluir permanentemente do banco de dados
                        </Label>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {permanentDelete ? 'Excluindo permanentemente...' : 'Desativando...'}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {permanentDelete ? 'Excluir Permanentemente' : 'Desativar'}
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
