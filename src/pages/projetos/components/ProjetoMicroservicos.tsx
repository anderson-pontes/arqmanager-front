import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, Briefcase } from 'lucide-react';
import { mockMicroservicos } from '@/data';

interface ProjetoMicroservicosProps {
    projetoId: number;
}

export function ProjetoMicroservicos({ projetoId }: ProjetoMicroservicosProps) {
    const microservicos = useMemo(
        () => mockMicroservicos.filter((m) => m.projetoId === projetoId),
        [projetoId]
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Microserviços
                    </CardTitle>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {microservicos.map((micro) => (
                        <div key={micro.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{micro.descricao}</h4>
                                <Badge
                                    className={
                                        micro.status === 'Concluído'
                                            ? 'bg-green-500'
                                            : micro.status === 'Em Andamento'
                                                ? 'bg-blue-500'
                                                : micro.status === 'Pendente'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                    }
                                >
                                    {micro.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                {micro.metragem && (
                                    <div>
                                        <span className="text-muted-foreground">Metragem:</span>
                                        <p className="font-medium">{micro.metragem} m²</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-muted-foreground">Valor:</span>
                                    <p className="font-semibold text-green-600">
                                        {formatCurrency(micro.valor)}
                                    </p>
                                </div>
                                {micro.dataInicio && (
                                    <div>
                                        <span className="text-muted-foreground">Início:</span>
                                        <p>{formatDate(micro.dataInicio)}</p>
                                    </div>
                                )}
                            </div>
                            {micro.observacao && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {micro.observacao}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
