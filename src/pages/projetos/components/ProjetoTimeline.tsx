import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatters';
import { Plus, Clock } from 'lucide-react';
import { mockTimeline } from '@/data';
import { useMemo } from 'react';

interface ProjetoTimelineProps {
    projetoId: number;
}

export function ProjetoTimeline({ projetoId }: ProjetoTimelineProps) {
    const timeline = useMemo(
        () =>
            mockTimeline
                .filter((item) => item.projetoId === projetoId)
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
        [projetoId]
    );

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Concluído':
                return 'bg-green-500';
            case 'Em Andamento':
                return 'bg-blue-500';
            case 'Pendente':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Linha do Tempo
                    </CardTitle>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Evento
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {timeline.map((item, index) => (
                        <div key={item.id} className="relative flex items-start gap-4">
                            {/* Ponto na linha */}
                            <div
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background ${item.cor ? `bg-[${item.cor}]` : getStatusColor(item.status)
                                    }`}
                                style={{ backgroundColor: item.cor }}
                            >
                                <div className="h-3 w-3 rounded-full bg-white" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline">{item.tipo}</Badge>
                                            {item.status && (
                                                <Badge
                                                    className={
                                                        item.status === 'Concluído'
                                                            ? 'bg-green-500'
                                                            : item.status === 'Em Andamento'
                                                                ? 'bg-blue-500'
                                                                : 'bg-yellow-500'
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className="font-semibold text-lg">{item.titulo}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {item.descricao}
                                        </p>
                                        {item.responsavel && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Responsável: {item.responsavel}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatDate(item.data)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {index === 0
                                                ? 'Hoje'
                                                : `${Math.ceil(
                                                    (new Date().getTime() -
                                                        new Date(item.data).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                                )} dias atrás`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {timeline.length === 0 && (
                    <div className="text-center py-12">
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">
                            Nenhum evento registrado ainda
                        </p>
                        <Button className="mt-4" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Primeiro Evento
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
