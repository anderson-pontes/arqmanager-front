import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoading } from '@/hooks/useLoading';
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
import { Plus, Search, Mail, Phone, Edit, Trash2, MapPin, Building2, User } from 'lucide-react';
import { mockClientes } from '@/data';
import { getInitials, formatPhone, formatCPF, formatCNPJ } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';

export function ClientesList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [clientes] = useState(mockClientes);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const isLoading = useLoading(800);

    const filteredClientes = useMemo(() => {
        return clientes.filter((cliente) =>
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.identificacao.includes(searchTerm) ||
            cliente.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clientes, searchTerm]);

    const totalPages = Math.ceil(filteredClientes.length / pageSize);

    const paginatedClientes = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredClientes.slice(startIndex, endIndex);
    }, [filteredClientes, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success('Cliente excluído com sucesso!');
        setDeleteDialogOpen(false);
    };

    if (isLoading) {
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
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por nome, email, CPF/CNPJ ou cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>{filteredClientes.length} Cliente(s)</CardTitle>
                    <CardDescription>Lista de todos os clientes cadastrados</CardDescription>
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
                            {paginatedClientes.map((cliente) => (
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
                                                    {cliente.tipoPessoa === 'Física'
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
                                                {cliente.endereco.cidade}, {cliente.endereco.uf}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cliente.tipoPessoa === 'Física' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}
                                        >
                                            {cliente.tipoPessoa === 'Física' ? (
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

                    {filteredClientes.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                        </div>
                    )}

                    {filteredClientes.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredClientes.length}
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
