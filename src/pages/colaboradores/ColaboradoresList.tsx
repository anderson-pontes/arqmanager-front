import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoading } from '@/hooks/useLoading';
import { SkeletonCard } from '@/components/common/SkeletonCard';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Mail, Phone, Edit, Trash2, KeyRound } from 'lucide-react';
import { mockColaboradores } from '@/data';
import { getInitials, formatPhone } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';

export function ColaboradoresList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [colaboradores] = useState(mockColaboradores);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const isLoading = useLoading(800);

    const filteredColaboradores = useMemo(() => {
        return colaboradores.filter((colab) =>
            colab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            colab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            colab.perfil.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [colaboradores, searchTerm]);

    const totalPages = Math.ceil(filteredColaboradores.length / pageSize);

    const paginatedColaboradores = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredColaboradores.slice(startIndex, endIndex);
    }, [filteredColaboradores, currentPage, pageSize]);

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
        // TODO: Implementar exclusão real
        toast.success('Colaborador excluído com sucesso!');
        setDeleteDialogOpen(false);
    };

    const handleResetPassword = (id: number) => {
        setSelectedId(id);
        setResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        try {
            // TODO: Implementar chamada à API para resetar senha
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const colaborador = colaboradores.find((c) => c.id === selectedId);
            toast.success(`Senha de ${colaborador?.nome} resetada com sucesso! Um email foi enviado.`);
            setResetPasswordDialogOpen(false);
        } catch (error) {
            toast.error('Erro ao resetar senha');
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageHeader title="Colaboradores" description="Gerencie os colaboradores do escritório" />
                <SkeletonCard hasHeader={false} lines={1} className="mb-6" />
                <SkeletonCard>
                    <SkeletonTable columns={5} rows={5} />
                </SkeletonCard>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Colaboradores"
                description="Gerencie os colaboradores do escritório"
                action={
                    <Button onClick={() => navigate('/colaboradores/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Colaborador
                    </Button>
                }
            />

            {/* Busca */}
            <Card className="mb-6 backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por nome, email ou perfil..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Colaboradores */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>
                        {filteredColaboradores.length} Colaborador(es)
                    </CardTitle>
                    <CardDescription>
                        Lista de todos os colaboradores cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Colaborador</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Perfil</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedColaboradores.map((colaborador) => (
                                <TableRow
                                    key={colaborador.id}
                                    className="cursor-pointer hover:bg-accent/50"
                                    onClick={() =>
                                        navigate(`/colaboradores/${colaborador.id}`)
                                    }
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={colaborador.foto} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(colaborador.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {colaborador.nome}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {colaborador.cpf}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {colaborador.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                {formatPhone(colaborador.telefone)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{colaborador.perfil}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {colaborador.ativo ? (
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
                                                    navigate(
                                                        `/colaboradores/${colaborador.id}/editar`
                                                    );
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
                                                    handleResetPassword(colaborador.id);
                                                }}
                                                title="Resetar Senha"
                                            >
                                                <KeyRound className="h-4 w-4 text-orange-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(colaborador.id);
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

                    {filteredColaboradores.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Nenhum colaborador encontrado
                            </p>
                        </div>
                    )}

                    {filteredColaboradores.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredColaboradores.length}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Dialog de Confirmação - Excluir */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Colaborador"
                description="Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />

            {/* Dialog de Confirmação - Resetar Senha */}
            <ConfirmDialog
                open={resetPasswordDialogOpen}
                onOpenChange={setResetPasswordDialogOpen}
                onConfirm={confirmResetPassword}
                title="Resetar Senha"
                description={`Tem certeza que deseja resetar a senha de ${colaboradores.find((c) => c.id === selectedId)?.nome}? Um email será enviado com as instruções para criar uma nova senha.`}
                confirmText="Resetar Senha"
            />
        </div>
    );
}
