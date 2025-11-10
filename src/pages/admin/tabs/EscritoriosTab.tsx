import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { adminService, type CreateEscritorioRequest, type CreateAdminRequest } from '@/api/services/admin.service';
import type { Escritorio } from '@/types';
import { toast } from 'sonner';
import { CreateEscritorioDialog } from '../dialogs/CreateEscritorioDialog';
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
    const [escritorios, setEscritorios] = useState<Escritorio[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
            await adminService.createEscritorioWithAdmin(escritorioData, adminData);
            toast.success('Escritório criado com sucesso!');
            setCreateDialogOpen(false);
            loadEscritorios();
        } catch (error: any) {
            toast.error('Erro ao criar escritório', {
                description: error.response?.data?.detail || error.message,
            });
            throw error;
        }
    };

    const handleDelete = async () => {
        if (!escritorioToDelete) return;

        try {
            await adminService.deleteEscritorio(escritorioToDelete.id);
            toast.success('Escritório desativado com sucesso!');
            setDeleteDialogOpen(false);
            setEscritorioToDelete(null);
            loadEscritorios();
        } catch (error: any) {
            toast.error('Erro ao desativar escritório', {
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
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        // TODO: Implementar edição
                                        toast.info('Edição em desenvolvimento');
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-destructive"
                                    onClick={() => {
                                        setEscritorioToDelete(escritorio);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Desativar
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

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Desativar Escritório?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja desativar o escritório{' '}
                            <strong>{escritorioToDelete?.nomeFantasia}</strong>?
                            <br />
                            Esta ação pode ser revertida posteriormente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                            Desativar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

