import { useState, useEffect } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Mail, Phone, Edit, Trash2, KeyRound, X, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { colaboradoresService, type Colaborador } from '@/api/services/colaboradores.service';
import { getInitials, formatPhone, formatCPF } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function ColaboradoresList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState(''); // Termo de busca ativo na API
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const isLoading = useLoading(800);

    // Buscar colaboradores da API apenas quando currentPage, pageSize ou activeSearch mudarem
    useEffect(() => {
        fetchColaboradores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, activeSearch]);

    const fetchColaboradores = async () => {
        try {
            setLoading(true);
            const skip = (currentPage - 1) * pageSize;
            const data = await colaboradoresService.list({
                skip,
                limit: pageSize,
                search: activeSearch || undefined,
            });
            setColaboradores(data);
            
            // Buscar total para paginação (apenas se não houver busca)
            // Se houver busca, usar o tamanho da lista como total aproximado
            if (activeSearch) {
                setTotal(data.length);
            } else {
                try {
                    const totalCount = await colaboradoresService.count();
                    setTotal(totalCount);
                } catch (countError) {
                    // Se falhar, usar o tamanho da lista como fallback
                    console.warn('Erro ao buscar total, usando tamanho da lista:', countError);
                    setTotal(data.length);
                }
            }
        } catch (error: any) {
            console.error('Erro ao buscar colaboradores:', error);
            toast.error('Erro ao carregar colaboradores');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setActiveSearch(searchTerm);
        setCurrentPage(1); // Resetar para primeira página ao buscar
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setActiveSearch('');
        setCurrentPage(1);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    const handleToggleStatus = (colaborador: Colaborador) => {
        setSelectedId(colaborador.id);
        setSelectedColaborador(colaborador);
        setDeleteDialogOpen(true);
    };

    const handleDelete = (colaborador: Colaborador, permanent: boolean = false) => {
        setSelectedId(colaborador.id);
        setSelectedColaborador(colaborador);
        if (permanent) {
            setHardDeleteDialogOpen(true);
        }
    };

    const confirmToggleStatus = async () => {
        if (!selectedId || !selectedColaborador) return;
        
        try {
            const novoStatus = !selectedColaborador.ativo;
            await colaboradoresService.update(selectedId, { ativo: novoStatus });
            toast.success(
                novoStatus 
                    ? 'Colaborador ativado com sucesso!' 
                    : 'Colaborador desativado com sucesso!'
            );
            setDeleteDialogOpen(false);
            setSelectedId(null);
            setSelectedColaborador(null);
            fetchColaboradores(); // Recarregar lista
        } catch (error: any) {
            console.error('Erro ao alterar status do colaborador:', error);
            const errorMessage = error.response?.data?.detail || 'Erro ao alterar status do colaborador';
            toast.error(errorMessage);
        }
    };

    const confirmDelete = async (permanent: boolean = false) => {
        if (!selectedId) return;
        
        try {
            await colaboradoresService.delete(selectedId, permanent);
            toast.success('Colaborador removido permanentemente!');
            setHardDeleteDialogOpen(false);
            setSelectedId(null);
            setSelectedColaborador(null);
            fetchColaboradores(); // Recarregar lista
        } catch (error: any) {
            console.error('Erro ao excluir colaborador:', error);
            const errorMessage = error.response?.data?.detail || 'Erro ao excluir colaborador';
            toast.error(errorMessage);
        }
    };

    const handleResetPassword = (id: number) => {
        setSelectedId(id);
        setResetPasswordDialogOpen(true);
    };

    const confirmResetPassword = async () => {
        if (!selectedId || !newPassword) {
            toast.error('Por favor, informe a nova senha');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            await colaboradoresService.update(selectedId, { senha: newPassword });
            const colaborador = colaboradores.find((c) => c.id === selectedId);
            toast.success(`Senha de ${colaborador?.nome} alterada com sucesso!`);
            setResetPasswordDialogOpen(false);
            setNewPassword('');
            setSelectedId(null);
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error);
            const errorMessage = error.response?.data?.detail || 'Erro ao alterar senha';
            toast.error(errorMessage);
        }
    };

    if (isLoading || loading) {
        return (
            <div>
                <PageHeader title="Colaboradores" description="Gerencie os colaboradores do escritório" />
                <div className="mb-6">
                    <SkeletonCard hasHeader={false} lines={1} />
                </div>
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <SkeletonTable columns={5} rows={5} />
                </Card>
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
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nome, email ou CPF..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-9"
                            />
                        </div>
                        <Button 
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar
                        </Button>
                        {(activeSearch || searchTerm) && (
                            <Button 
                                variant="outline"
                                onClick={handleClearFilters}
                                disabled={loading}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Limpar Filtros
                            </Button>
                        )}
                    </div>
                    {activeSearch && (
                        <div className="mt-3 text-sm text-muted-foreground">
                            Buscando por: <span className="font-medium">{activeSearch}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Lista de Colaboradores */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle>
                        {total} Colaborador(es)
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
                            {colaboradores.map((colaborador) => (
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
                                                    {formatCPF(colaborador.cpf)}
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
                                            {colaborador.telefone ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {formatPhone(colaborador.telefone)}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    Não informado
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {colaborador.perfis && colaborador.perfis.length > 0 ? (
                                                colaborador.perfis.map((perfilItem) => (
                                                    <Badge key={perfilItem.id} variant="outline">
                                                        {perfilItem.perfil}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline">{colaborador.perfil || 'Colaborador'}</Badge>
                                            )}
                                        </div>
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Mais opções"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/colaboradores/${colaborador.id}/editar`);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResetPassword(colaborador.id);
                                                        }}
                                                    >
                                                        <KeyRound className="mr-2 h-4 w-4" />
                                                        Resetar Senha
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleStatus(colaborador);
                                                        }}
                                                        className={colaborador.ativo 
                                                            ? "text-orange-600 focus:text-orange-600" 
                                                            : "text-green-600 focus:text-green-600"
                                                        }
                                                    >
                                                        {colaborador.ativo ? (
                                                            <>
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                Desativar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Ativar
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(colaborador, true);
                                                        }}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir Permanentemente
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {colaboradores.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Nenhum colaborador encontrado
                            </p>
                        </div>
                    )}

                    {total > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={total}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Dialog de Confirmação - Ativar/Desativar */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmToggleStatus}
                title={selectedColaborador?.ativo ? "Desativar Colaborador" : "Ativar Colaborador"}
                description={
                    selectedColaborador
                        ? selectedColaborador.ativo
                            ? `Tem certeza que deseja desativar ${selectedColaborador.nome}? O colaborador não poderá mais acessar o sistema, mas os dados serão mantidos.`
                            : `Tem certeza que deseja ativar ${selectedColaborador.nome}? O colaborador poderá acessar o sistema novamente.`
                        : 'Tem certeza que deseja alterar o status deste colaborador?'
                }
                confirmText={selectedColaborador?.ativo ? "Desativar" : "Ativar"}
                variant="default"
            />

            {/* Dialog de Confirmação - Excluir Permanentemente (Hard Delete) */}
            <ConfirmDialog
                open={hardDeleteDialogOpen}
                onOpenChange={setHardDeleteDialogOpen}
                onConfirm={() => confirmDelete(true)}
                title="Excluir Permanentemente"
                description={
                    selectedColaborador
                        ? `⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente ${selectedColaborador.nome}? Esta ação é IRREVERSÍVEL e todos os dados relacionados serão removidos do sistema.`
                        : '⚠️ ATENÇÃO: Tem certeza que deseja excluir permanentemente este colaborador? Esta ação é IRREVERSÍVEL e todos os dados relacionados serão removidos do sistema.'
                }
                confirmText="Excluir Permanentemente"
                variant="destructive"
            />

            {/* Dialog - Alterar Senha */}
            <Dialog 
                open={resetPasswordDialogOpen} 
                onOpenChange={(open) => {
                    setResetPasswordDialogOpen(open);
                    if (!open) {
                        setNewPassword('');
                        setSelectedId(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>
                            Digite a nova senha para {colaboradores.find((c) => c.id === selectedId)?.nome || 'este colaborador'}. 
                            A senha deve ter no mínimo 6 caracteres.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Digite a nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        confirmResetPassword();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setResetPasswordDialogOpen(false);
                                setNewPassword('');
                                setSelectedId(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmResetPassword}
                            disabled={!newPassword || newPassword.length < 6}
                        >
                            Alterar Senha
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
