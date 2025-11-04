import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Edit, Trash2, CalendarDays } from 'lucide-react';
import { mockFeriados } from '@/data';
import { formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

export function CalendarioPage() {
    const navigate = useNavigate();
    const [feriados] = useState(mockFeriados);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const feriadosNacionais = feriados.filter((f) => f.tipo === 'Nacional');
    const feriadosEstaduais = feriados.filter((f) => f.tipo === 'Estadual');
    const feriadosMunicipais = feriados.filter((f) => f.tipo === 'Municipal');
    const pontosFacultativos = feriados.filter((f) => f.tipo === 'Ponto Facultativo');

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success('Feriado excluído com sucesso!');
        setDeleteDialogOpen(false);
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'Nacional':
                return 'bg-red-500';
            case 'Estadual':
                return 'bg-blue-500';
            case 'Municipal':
                return 'bg-green-500';
            case 'Ponto Facultativo':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const FeriadoCard = ({ feriado }: { feriado: any }) => (
        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: feriado.cor + '20' }}
                        >
                            <CalendarDays className="h-6 w-6" style={{ color: feriado.cor }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{feriado.nome}</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(feriado.data)}</p>
                            {feriado.descricao && (
                                <p className="text-sm text-muted-foreground mt-1">{feriado.descricao}</p>
                            )}
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className={getTipoColor(feriado.tipo) + ' text-white border-0'}>
                                    {feriado.tipo}
                                </Badge>
                                {feriado.recorrente && (
                                    <Badge variant="secondary">Recorrente</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/calendario/feriados/${feriado.id}/editar`)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(feriado.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div>
            <PageHeader
                title="Gerenciar Feriados"
                description="Gerencie os feriados do escritório"
                showBack
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/calendario')}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver Calendário
                        </Button>
                        <Button onClick={() => navigate('/calendario/feriados/novo')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Feriado
                        </Button>
                    </div>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-red-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nacionais</CardTitle>
                        <Calendar className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feriadosNacionais.length}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estaduais</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feriadosEstaduais.length}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Municipais</CardTitle>
                        <Calendar className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feriadosMunicipais.length}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-yellow-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Facultativos</CardTitle>
                        <Calendar className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pontosFacultativos.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs de Feriados */}
            <Tabs defaultValue="todos" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="todos">Todos ({feriados.length})</TabsTrigger>
                    <TabsTrigger value="nacionais">Nacionais ({feriadosNacionais.length})</TabsTrigger>
                    <TabsTrigger value="estaduais">Estaduais ({feriadosEstaduais.length})</TabsTrigger>
                    <TabsTrigger value="municipais">Municipais ({feriadosMunicipais.length})</TabsTrigger>
                    <TabsTrigger value="facultativos">Facultativos ({pontosFacultativos.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="todos">
                    <div className="grid gap-4 md:grid-cols-2">
                        {feriados.map((feriado) => (
                            <FeriadoCard key={feriado.id} feriado={feriado} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="nacionais">
                    <div className="grid gap-4 md:grid-cols-2">
                        {feriadosNacionais.map((feriado) => (
                            <FeriadoCard key={feriado.id} feriado={feriado} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="estaduais">
                    <div className="grid gap-4 md:grid-cols-2">
                        {feriadosEstaduais.length > 0 ? (
                            feriadosEstaduais.map((feriado) => (
                                <FeriadoCard key={feriado.id} feriado={feriado} />
                            ))
                        ) : (
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-2">
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Nenhum feriado estadual cadastrado</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="municipais">
                    <div className="grid gap-4 md:grid-cols-2">
                        {feriadosMunicipais.length > 0 ? (
                            feriadosMunicipais.map((feriado) => (
                                <FeriadoCard key={feriado.id} feriado={feriado} />
                            ))
                        ) : (
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-2">
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">Nenhum feriado municipal cadastrado</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="facultativos">
                    <div className="grid gap-4 md:grid-cols-2">
                        {pontosFacultativos.map((feriado) => (
                            <FeriadoCard key={feriado.id} feriado={feriado} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Feriado"
                description="Tem certeza que deseja excluir este feriado? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />
        </div>
    );
}
