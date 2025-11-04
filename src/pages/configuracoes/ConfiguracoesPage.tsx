import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Tag, CheckCircle, Briefcase, Palette } from 'lucide-react';
import { mockCategorias, mockStatus, mockServicos } from '@/data';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

export function ConfiguracoesPage() {
    const navigate = useNavigate();
    const [categorias] = useState(mockCategorias);
    const [status] = useState(mockStatus);
    const [servicos] = useState(mockServicos);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleteType, setDeleteType] = useState<'categoria' | 'status' | 'servico'>('categoria');

    const handleDelete = (id: number, type: 'categoria' | 'status' | 'servico') => {
        setSelectedId(id);
        setDeleteType(type);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} excluído(a) com sucesso!`);
        setDeleteDialogOpen(false);
    };

    return (
        <div>
            <PageHeader
                title="Configurações"
                description="Gerencie categorias, status e serviços do sistema"
            />

            <Tabs defaultValue="categorias" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="categorias">
                        <Tag className="mr-2 h-4 w-4" />
                        Categorias Financeiras
                    </TabsTrigger>
                    <TabsTrigger value="status">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Status
                    </TabsTrigger>
                    <TabsTrigger value="servicos">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Serviços
                    </TabsTrigger>
                </TabsList>

                {/* Categorias Financeiras */}
                <TabsContent value="categorias">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Categorias Financeiras</CardTitle>
                                    <CardDescription>
                                        Gerencie as categorias de receitas e despesas
                                    </CardDescription>
                                </div>
                                <Button onClick={() => navigate('/configuracoes/categorias/novo')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Categoria
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Receitas */}
                                <div>
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        Receitas ({categorias.filter((c) => c.tipo === 'Receita').length})
                                    </h3>
                                    <div className="space-y-2">
                                        {categorias
                                            .filter((c) => c.tipo === 'Receita')
                                            .map((categoria) => (
                                                <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-4 h-4 rounded"
                                                                    style={{ backgroundColor: categoria.cor }}
                                                                ></div>
                                                                <span className="font-medium">{categoria.nome}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={categoria.ativo ? 'default' : 'secondary'}>
                                                                    {categoria.ativo ? 'Ativa' : 'Inativa'}
                                                                </Badge>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        navigate(`/configuracoes/categorias/${categoria.id}/editar`)
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(categoria.id, 'categoria')}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>

                                {/* Despesas */}
                                <div>
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        Despesas ({categorias.filter((c) => c.tipo === 'Despesa').length})
                                    </h3>
                                    <div className="space-y-2">
                                        {categorias
                                            .filter((c) => c.tipo === 'Despesa')
                                            .map((categoria) => (
                                                <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-4 h-4 rounded"
                                                                    style={{ backgroundColor: categoria.cor }}
                                                                ></div>
                                                                <span className="font-medium">{categoria.nome}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={categoria.ativo ? 'default' : 'secondary'}>
                                                                    {categoria.ativo ? 'Ativa' : 'Inativa'}
                                                                </Badge>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        navigate(`/configuracoes/categorias/${categoria.id}/editar`)
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(categoria.id, 'categoria')}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Status */}
                <TabsContent value="status">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Status de Projetos e Propostas</CardTitle>
                                    <CardDescription>Gerencie os status do sistema</CardDescription>
                                </div>
                                <Button onClick={() => navigate('/configuracoes/status/novo')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Status
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Status de Propostas */}
                                <div>
                                    <h3 className="font-semibold mb-4">
                                        Status de Propostas ({status.filter((s) => s.tipo === 'proposta').length})
                                    </h3>
                                    <div className="space-y-2">
                                        {status
                                            .filter((s) => s.tipo === 'proposta')
                                            .map((item) => (
                                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-4 h-4 rounded"
                                                                    style={{ backgroundColor: item.cor }}
                                                                ></div>
                                                                <span className="font-medium">{item.nome}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        navigate(`/configuracoes/status/${item.id}/editar`)
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(item.id, 'status')}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>

                                {/* Status de Projetos */}
                                <div>
                                    <h3 className="font-semibold mb-4">
                                        Status de Projetos ({status.filter((s) => s.tipo === 'projeto').length})
                                    </h3>
                                    <div className="space-y-2">
                                        {status
                                            .filter((s) => s.tipo === 'projeto')
                                            .map((item) => (
                                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-4 h-4 rounded"
                                                                    style={{ backgroundColor: item.cor }}
                                                                ></div>
                                                                <span className="font-medium">{item.nome}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        navigate(`/configuracoes/status/${item.id}/editar`)
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(item.id, 'status')}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Serviços */}
                <TabsContent value="servicos">
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Serviços Oferecidos</CardTitle>
                                    <CardDescription>
                                        Gerencie os serviços e suas etapas
                                    </CardDescription>
                                </div>
                                <Button onClick={() => navigate('/configuracoes/servicos/novo')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Serviço
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {servicos.map((servico) => (
                                    <Card key={servico.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{servico.nome}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {servico.descricao}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={servico.ativo ? 'default' : 'secondary'}>
                                                        {servico.ativo ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            navigate(`/configuracoes/servicos/${servico.id}/editar`)
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(servico.id, 'servico')}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="border-t pt-4">
                                                <p className="text-sm font-medium mb-2">
                                                    Etapas ({servico.etapas.length}):
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {servico.etapas.map((etapa) => (
                                                        <Badge key={etapa.id} variant="outline">
                                                            {etapa.ordem}. {etapa.nome}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title={`Excluir ${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}`}
                description={`Tem certeza que deseja excluir este(a) ${deleteType}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                variant="destructive"
            />
        </div>
    );
}
