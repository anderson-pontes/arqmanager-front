import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, ClipboardCheck, Download } from 'lucide-react';
import { mockRRTs } from '@/data';

interface ProjetoRRTsProps {
    projetoId: number;
}

export function ProjetoRRTs({ projetoId }: ProjetoRRTsProps) {
    const rrts = useMemo(() => mockRRTs.filter((r) => r.projetoId === projetoId), [projetoId]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        RRT - Registro de Responsabilidade Técnica
                    </CardTitle>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Gerar RRT
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {rrts.map((rrt) => (
                        <div key={rrt.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold">{rrt.numero}</h4>
                                    <p className="text-sm text-muted-foreground">{rrt.tipo}</p>
                                </div>
                                <Badge
                                    className={
                                        rrt.status === 'Emitida'
                                            ? 'bg-green-500'
                                            : rrt.status === 'Pendente'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                    }
                                >
                                    {rrt.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Responsável:</span>
                                    <p className="font-medium">{rrt.responsavelTecnico}</p>
                                    <p className="text-xs text-muted-foreground">{rrt.registro}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Valor:</span>
                                    <p className="font-semibold">{formatCurrency(rrt.valor)}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Emissão:</span>
                                    <p>{formatDate(rrt.dataEmissao)}</p>
                                </div>
                                {rrt.dataValidade && (
                                    <div>
                                        <span className="text-muted-foreground">Validade:</span>
                                        <p>{formatDate(rrt.dataValidade)}</p>
                                    </div>
                                )}
                            </div>
                            {rrt.arquivo && (
                                <Button size="sm" variant="outline" className="mt-3">
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar RRT
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
