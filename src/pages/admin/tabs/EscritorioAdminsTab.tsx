import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Building2, Mail, Phone, Edit, Trash2, Power, X } from 'lucide-react';
import { adminService, type CreateAdminRequest } from '@/api/services/admin.service';
import type { User, Escritorio } from '@/types';
import { toast } from 'sonner';
import { CreateAdminDialog } from '../dialogs/CreateAdminDialog';
import { EditAdminDialog } from '../dialogs/EditAdminDialog';
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

export function EscritorioAdminsTab() {
    const [escritorios, setEscritorios] = useState<Escritorio[]>([]);
    const [selectedEscritorio, setSelectedEscritorio] = useState<number | null>(null);
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState<User | null>(null);
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
    const [adminToToggle, setAdminToToggle] = useState<User | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<User | null>(null);

    const loadEscritorios = async () => {
        try {
            const data = await adminService.listEscritorios({ limit: 1000, ativo: true });
            setEscritorios(data);
            if (data.length > 0 && !selectedEscritorio) {
                setSelectedEscritorio(data[0].id);
            }
        } catch (error: any) {
            toast.error('Erro ao carregar escritórios', {
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    const loadAdmins = async () => {
        if (!selectedEscritorio) return;

        try {
            setLoading(true);
            const data = await adminService.listEscritorioAdmins(selectedEscritorio, { limit: 1000 });
            setAdmins(data);
        } catch (error: any) {
            toast.error('Erro ao carregar administradores', {
                description: error.response?.data?.detail || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEscritorios();
    }, []);

    useEffect(() => {
        if (selectedEscritorio) {
            loadAdmins();
        }
    }, [selectedEscritorio]);

    const handleCreate = async (adminData: CreateAdminRequest) => {
        if (!selectedEscritorio) return;

        try {
            await adminService.createEscritorioAdmin(selectedEscritorio, adminData);
            toast.success('Administrador do escritório criado com sucesso!');
            setCreateDialogOpen(false);
            loadAdmins();
        } catch (error: any) {
            toast.error('Erro ao criar administrador', {
                description: error.response?.data?.detail || error.message,
            });
            throw error;
        }
    };

    const handleEdit = async (userId: number, data: Partial<CreateAdminRequest> & { senha?: string }) => {
        if (!selectedEscritorio) return;

        try {
            await adminService.updateEscritorioAdmin(selectedEscritorio, userId, data);
            toast.success('Administrador atualizado com sucesso!');
            setEditDialogOpen(false);
            setAdminToEdit(null);
            loadAdmins();
        } catch (error: any) {
            toast.error('Erro ao atualizar administrador', {
                description: error.response?.data?.detail || error.message,
            });
            throw error;
        }
    };

    const handleToggle = async () => {
        if (!adminToToggle || !selectedEscritorio) return;

        try {
            await adminService.toggleEscritorioAdminActive(selectedEscritorio, adminToToggle.id);
            toast.success(
                adminToToggle.ativo
                    ? 'Administrador desativado com sucesso!'
                    : 'Administrador ativado com sucesso!'
            );
            setToggleDialogOpen(false);
            setAdminToToggle(null);
            loadAdmins();
        } catch (error: any) {
            toast.error('Erro ao alterar status do administrador', {
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    const handleDelete = async () => {
        if (!adminToDelete || !selectedEscritorio) return;

        try {
            await adminService.deleteEscritorioAdmin(selectedEscritorio, adminToDelete.id);
            toast.success('Administrador removido permanentemente!');
            setDeleteDialogOpen(false);
            setAdminToDelete(null);
            loadAdmins();
        } catch (error: any) {
            toast.error('Erro ao remover administrador', {
                description: error.response?.data?.detail || error.message,
            });
        }
    };

    const selectedEscritorioData = escritorios.find((e) => e.id === selectedEscritorio);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold">Administradores de Escritório</h2>
                    <p className="text-muted-foreground text-sm">
                        Gerencie os administradores de cada escritório
                    </p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    disabled={!selectedEscritorio || escritorios.length === 0}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Admin do Escritório
                </Button>
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-sm">Selecione o Escritório</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedEscritorio?.toString() || ''}
                        onValueChange={(value) => setSelectedEscritorio(parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um escritório" />
                        </SelectTrigger>
                        <SelectContent>
                            {escritorios.map((escritorio) => (
                                <SelectItem key={escritorio.id} value={escritorio.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: escritorio.cor }}
                                        />
                                        {escritorio.nomeFantasia}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedEscritorio && (
                <>
                    {loading ? (
                        <Card>
                            <CardContent className="py-10">
                                <div className="text-center text-muted-foreground">
                                    Carregando administradores...
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground">
                                    Administradores do escritório:{' '}
                                    <strong>{selectedEscritorioData?.nomeFantasia}</strong>
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {admins.map((admin) => (
                                    <Card key={admin.id} className={!admin.ativo ? 'opacity-60' : ''}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-primary" />
                                                    <CardTitle className="text-lg">{admin.nome}</CardTitle>
                                                </div>
                                                {!admin.ativo && (
                                                    <span className="text-xs text-muted-foreground">Inativo</span>
                                                )}
                                            </div>
                                            <CardDescription>Administrador do Escritório</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span>{admin.email}</span>
                                            </div>
                                            {admin.telefone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{admin.telefone}</span>
                                                </div>
                                            )}
                                            <div className="pt-2">
                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                                    {admin.perfil}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setAdminToEdit(admin);
                                                        setEditDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Editar
                                                </Button>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => {
                                                            setAdminToToggle(admin);
                                                            setToggleDialogOpen(true);
                                                        }}
                                                    >
                                                        <Power className="h-4 w-4 mr-1" />
                                                        {admin.ativo ? 'Desativar' : 'Ativar'}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            setAdminToDelete(admin);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {admins.length === 0 && (
                                <Card>
                                    <CardContent className="py-10">
                                        <div className="text-center space-y-2">
                                            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                Nenhum administrador cadastrado para este escritório
                                            </p>
                                            <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Criar Primeiro Admin
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </>
            )}

            {escritorios.length === 0 && (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center space-y-2">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">
                                Nenhum escritório cadastrado. Crie um escritório primeiro.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <CreateAdminDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreate}
                title="Criar Administrador do Escritório"
                description={`Crie um novo administrador para o escritório ${selectedEscritorioData?.nomeFantasia}.`}
            />

            <EditAdminDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                admin={adminToEdit}
                onSubmit={handleEdit}
            />

            <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {adminToToggle?.ativo
                                ? 'Desativar Administrador?'
                                : 'Ativar Administrador?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {adminToToggle?.ativo ? (
                                <>
                                    Tem certeza que deseja desativar o administrador{' '}
                                    <strong>{adminToToggle?.nome}</strong>?
                                    <br />
                                    O administrador ficará inativo, mas poderá ser reativado posteriormente.
                                </>
                            ) : (
                                <>
                                    Tem certeza que deseja ativar o administrador{' '}
                                    <strong>{adminToToggle?.nome}</strong>?
                                    <br />
                                    O administrador voltará a estar ativo no sistema.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggle}>
                            {adminToToggle?.ativo ? 'Desativar' : 'Ativar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Administrador Permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover permanentemente o administrador{' '}
                            <strong>{adminToDelete?.nome}</strong>?
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

