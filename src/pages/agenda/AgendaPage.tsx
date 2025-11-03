import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, Clock, FolderKanban, AlertCircle } from 'lucide-react';
import { mockFeriados, mockProjetos } from '@/data';
import { formatDate } from '@/utils/formatters';

export function AgendaPage() {
    const navigate = useNavigate();
    const [selectedProjeto, setSelectedProjeto] = useState<string>('todos');

    // Combinar feriados e prazos de projetos
    const eventos = useMemo(() => {
        const feriadosEvento = mockFeriados.map((feriado) => ({
            id: `feriado-${feriado.id}`,
            tipo: 'feriado' as const,
            titulo: feriado.nome,
            data: feriado.data,
            descricao: feriado.descricao,
            cor: feriado.cor,
            tipoFeriado: feriado.tipo,
        }));

        // Filtrar projetos
        const projetosFiltrados =
            selectedProjeto === 'todos'
                ? mockProjetos
                : mockProjetos.filter((p) => p.id === Number(selectedProjeto));

        // Extrair prazos dos projetos
        const prazosEvento = projetosFiltrados.flatMap((projeto) =>
            projeto.etapas.map((etapa) => ({
                id: `prazo-${projeto.id}-${etapa.id}`,
                tipo: 'prazo' as const,
                titulo: etapa.etapa,
                data: etapa.dataPrevista,
                descricao: `Projeto: ${projeto.numero} - ${projeto.cliente.nome}`,
                cor: etapa.status === 'Concluído' ? '#28A745' : etapa.status === 'Em Andamento' ? '#FFC107' : '#6C757D',
                status: etapa.status,
                projeto: {
                    id: projeto.id,
                    numero: projeto.numero,
                    cliente: projeto.cliente.nome,
                },
            }))
        );

        // Combinar e ordenar por data
        return [...feriadosEvento, ...prazosEvento].sort(
            (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
    }, [selectedProjeto]);

    // Agrupar eventos por mês
    const eventosPorMes = useMemo(() => {
        const grupos: Record<string, typeof eventos> = {};
        eventos.forEach((evento) => {
            const data = new Date(evento.data);
            const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            if (!grupos[mesAno]) {
                grupos[mesAno] = [];
            }
            grupos[mesAno].push(evento);
        });
        return grupos;
    }, [eventos]);

    const getMesNome = (mesAno: string) => {
        const [ano, mes] = mesAno.split('-');
        const data = new Date(Number(ano), Number(mes) - 1);
        return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const totalFeriados = eventos.filter((e) => e.tipo === 'feriado').length;
    const totalPrazos = eventos.filter((e) => e.tipo === 'prazo').length;
    const prazosAtrasados = eventos.filter(
        (e) => e.tipo === 'prazo' && e.status === 'Pendente' && new Date(e.data) < new Date()
    ).length;

    return (
        <div>
            <PageHeader
                title="Agenda"
                description="Visualize feriados e prazos de projetos"
                action={
                    <Button onClick={() => navigate('/agenda/feriados')}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Gerenciar Feriados
                    </Button>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{eventos.length}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-red-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Feriados</CardTitle>
                        <CalendarDays className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{totalFeriados}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-blue-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prazos</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalPrazos}</div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-orange-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{prazosAtrasados}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtro de Projeto */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <FolderKanban className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                            <Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Projetos</SelectItem>
                                    {mockProjetos.map((projeto) => (
                                        <SelectItem key={projeto.id} value={projeto.id.toString()}>
                                            {projeto.numero} - {projeto.cliente.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline de Eventos */}
            <div className="space-y-6">
                {Object.entries(eventosPorMes).map(([mesAno, eventosDoMes]) => (
                    <Card key={mesAno} className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="capitalize">{getMesNome(mesAno)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {eventosDoMes.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: evento.cor + '20' }}
                                        >
                                            {evento.tipo === 'feriado' ? (
                                                <CalendarDays className="h-6 w-6" style={{ color: evento.cor }} />
                                            ) : (
                                                <Clock className="h-6 w-6" style={{ color: evento.cor }} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{evento.titulo}</h4>
                                                    <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                                                    {evento.tipo === 'prazo' && evento.projeto && (
                                                        <div className="flex gap-2 mt-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="cursor-pointer"
                                                                onClick={() => navigate(`/projetos/${evento.projeto.id}`)}
                                                            >
                                                                <FolderKanban className="mr-1 h-3 w-3" />
                                                                {evento.projeto.numero}
                                                            </Badge>
                                                            {evento.status && (
                                                                <Badge
                                                                    variant={
                                                                        evento.status === 'Concluído'
                                                                            ? 'default'
                                                                            : evento.status === 'Em Andamento'
                                                                                ? 'secondary'
                                                                                : 'outline'
                                                                    }
                                                                >
                                                                    {evento.status}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                    {evento.tipo === 'feriado' && evento.tipoFeriado && (
                                                        <Badge variant="outline" className="mt-2">
                                                            {evento.tipoFeriado}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{formatDate(evento.data)}</p>
                                                    {evento.tipo === 'prazo' &&
                                                        evento.status === 'Pendente' &&
                                                        new Date(evento.data) < new Date() && (
                                                            <Badge variant="destructive" className="mt-1">
                                                                Atrasado
                                                            </Badge>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {eventos.length === 0 && (
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">Nenhum evento encontrado</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
