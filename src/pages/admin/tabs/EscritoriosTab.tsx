import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Edit, Trash2, Mail, Phone, MapPin, Power, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService, type CreateEscritorioRequest, type CreateAdminRequest } from '@/api/services/admin.service';
import type { Escritorio } from '@/types';
import { toast } from 'sonner';
import { CreateEscritorioDialog } from '../dialogs/CreateEscritorioDialog';
import { EditEscritorioDialog } from '../dialogs/EditEscritorioDialog';
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

export function EscritoriosTab() {
    const navigate = useNavigate();
    const [escritorios, setEscritorios] = useState<Escritorio[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [escritorioToEdit, setEscritorioToEdit] = useState<Escritorio | null>(null);
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
    const [escritorioToToggle, setEscritorioToToggle] = useState<Escritorio | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [escritorioToDelete, setEscritorioToDelete] = useState<Escritorio | null>(null);

    const loadEscritorios = async () => {
        try {
            setLoading(true);
            const data = await adminService.listEscritorios({ limit: 1000 });
            setEscritorios(data);
        } catch (error: any) {
            toast.error('Erro ao carregar escritórios', {
                description: error.response?.data?.detail || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEscritorios();
    }, []);

    const handleCreate = async (escritorioData: CreateEscritorioRequest, adminData: CreateAdminRequest) => {
        try {
            const result = await adminService.createEscritorioWithAdmin(escritorioData, adminData);
            toast.success('Escritório criado com sucesso!');
            setCreateDialogOpen(false);
            // Adicionar o novo escritório na lista
            setEscritorios((prev) => [result.escritorio, ...prev]);
        } catch (error: any) {
            toast.error('Erro ao criar escritório', {
                description: error.response?.data?.detail || error.message,
            });
            throw error;
        }
    };

    const handleEdit = async (id: number, data: Partial<CreateEscritorioRequest>) => {
        try {
            const updated = await adminService.updateEscritorio(id, data);
            toast.success('Escritório atualizado com sucesso!');
            setEditDialogOpen(false);
            setEscritorioToEdit(null);
            // Atualizar o escritório na lista localmente
            setEscritorios((prev) =>
                prev.map((e) => (e.id === id ? updated : e))
            );
        } catch (error: any) {
            toast.error('Erro ao atualizar escritório', {
                description: error.response?.data?.detail || error.message,
            });
            throw error;
        }
    };

    const handleToggle = async () => {
        if (!escritorioToToggle) return;

        try {
            await adminService.toggleEscritorioActive(escritorioToToggle.id);
            toast.success(
                escritorioToToggle.ativo
                    ? 'Escritório desativado com sucesso!'
                    : 'Escritório ativado com sucesso!'
            );
            setToggleDialogOpen(false);
            setEscritorioToToggle(null);
            loadEscritorios();
        } catch (error: any) {
            toast.error('Erro ao alterar status do escritório', {
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    const handleDelete = async () => {
        if (!escritorioToDelete) return;

        try {
            await adminService.deleteEscritorio(escritorioToDelete.id);
            toast.success('Escritório removido permanentemente!');
            setDeleteDialogOpen(false);
            setEscritorioToDelete(null);
            loadEscritorios();
        } catch (error: any) {
            toast.error('Erro ao remover escritório', {
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">Carregando escritórios...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold">Escritórios</h2>
                    <p className="text-muted-foreground text-sm">
                        Gerencie todos os escritórios do sistema
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Escritório
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {escritorios.map((escritorio) => (
                    <Card key={escritorio.id} className={!escritorio.ativo ? 'opacity-60' : ''}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: escritorio.cor }}
                                    />
                                    <CardTitle className="text-lg">{escritorio.nomeFantasia}</CardTitle>
                                </div>
                                {!escritorio.ativo && (
                                    <span className="text-xs text-muted-foreground">Inativo</span>
                                )}
                            </div>
                            <CardDescription>{escritorio.razaoSocial}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{escritorio.email}</span>
                                </div>
                                {escritorio.telefone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{escritorio.telefone}</span>
                                    </div>
                                )}
                                {escritorio.endereco && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{escritorio.endereco}</span>
                                    </div>
                                )}
                                <div className="text-muted-foreground">
                                    <span className="font-medium">CNPJ:</span> {escritorio.documento}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => navigate(`/admin/escritorios/${escritorio.id}`)}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Visualizar
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                            setEscritorioToEdit(escritorio);
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                            setEscritorioToToggle(escritorio);
                                            setToggleDialogOpen(true);
                                        }}
                                    >
                                        <Power className="h-4 w-4 mr-1" />
                                        {escritorio.ativo ? 'Desativar' : 'Ativar'}
                                    </Button>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => {
                                        setEscritorioToDelete(escritorio);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Excluir Permanentemente
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {escritorios.length === 0 && (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center space-y-2">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">Nenhum escritório cadastrado</p>
                            <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeiro Escritório
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <CreateEscritorioDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreate}
            />

            <EditEscritorioDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                escritorio={escritorioToEdit}
                onSubmit={handleEdit}
            />

            <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {escritorioToToggle?.ativo
                                ? 'Desativar Escritório?'
                                : 'Ativar Escritório?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {escritorioToToggle?.ativo ? (
                                <>
                                    Tem certeza que deseja desativar o escritório{' '}
                                    <strong>{escritorioToToggle?.nomeFantasia}</strong>?
                                    <br />
                                    O escritório ficará inativo, mas poderá ser reativado posteriormente.
                                </>
                            ) : (
                                <>
                                    Tem certeza que deseja ativar o escritório{' '}
                                    <strong>{escritorioToToggle?.nomeFantasia}</strong>?
                                    <br />
                                    O escritório voltará a estar ativo no sistema.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggle}>
                            {escritorioToToggle?.ativo ? 'Desativar' : 'Ativar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Escritório Permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover permanentemente o escritório{' '}
                            <strong>{escritorioToDelete?.nomeFantasia}</strong>?
                            <br />
                            <strong className="text-destructive">
                                Esta ação não pode ser desfeita! Todos os dados relacionados serão perdidos.
                            </strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Excluir Permanentemente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

