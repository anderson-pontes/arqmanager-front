import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserCog, Mail, Phone } from 'lucide-react';
import { adminService, type CreateAdminRequest } from '@/api/services/admin.service';
import type { User } from '@/types';
import { toast } from 'sonner';
import { CreateAdminDialog } from '../dialogs/CreateAdminDialog';

export function SystemAdminsTab() {
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminService.listSystemAdmins({ limit: 1000 });
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
        loadAdmins();
    }, []);

    const handleCreate = async (adminData: CreateAdminRequest) => {
        try {
            await adminService.createSystemAdmin(adminData);
            toast.success('Administrador do sistema criado com sucesso!');
            setCreateDialogOpen(false);
            loadAdmins();
        } catch (error: any) {
            console.error('Erro ao criar administrador:', error);
            console.error('Erro completo:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            
            let errorMessage = 'Erro desconhecido ao criar administrador';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.errors) {
                    // Erros de validação do Pydantic
                    const validationErrors = errorData.errors.map((e: any) => {
                        const field = e.loc?.join('.') || 'campo';
                        return `${field}: ${e.msg}`;
                    });
                    errorMessage = validationErrors.join('; ');
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error('Erro ao criar administrador', {
                description: errorMessage,
            });
            throw error;
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">Carregando administradores...</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold">Administradores do Sistema</h2>
                    <p className="text-muted-foreground text-sm">
                        Gerencie os administradores do sistema que têm acesso a todos os escritórios
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Admin do Sistema
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {admins.map((admin) => (
                    <Card key={admin.id}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UserCog className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">{admin.nome}</CardTitle>
                            </div>
                            <CardDescription>Administrador do Sistema</CardDescription>
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
                        </CardContent>
                    </Card>
                ))}
            </div>

            {admins.length === 0 && (
                <Card>
                    <CardContent className="py-10">
                        <div className="text-center space-y-2">
                            <UserCog className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">Nenhum administrador do sistema cadastrado</p>
                            <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeiro Admin
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <CreateAdminDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreate}
                title="Criar Administrador do Sistema"
                description="Crie um novo administrador do sistema que terá acesso a todos os escritórios."
            />
        </>
    );
}

