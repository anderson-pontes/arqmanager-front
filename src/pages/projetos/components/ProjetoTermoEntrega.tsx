import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { Plus, Calendar, CheckCircle } from 'lucide-react';
import { mockTermosEntrega } from '@/data';

interface ProjetoTermoEntregaProps {
    projetoId: number;
}

export function ProjetoTermoEntrega({ projetoId }: ProjetoTermoEntregaProps) {
    const termos = useMemo(
        () => mockTermosEntrega.filter((t) => t.projetoId === projetoId),
        [projetoId]
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Termo de Entrega
                    </CardTitle>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Gerar Termo
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {termos.map((termo) => (
                        <div key={termo.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold">
                                        Termo de Entrega - {formatDate(termo.dataEntrega)}
                                    </h4>
                                </div>
                                <Badge
                                    className={
                                        termo.status === 'Assinado'
                                            ? 'bg-green-500'
                                            : termo.status === 'Pendente'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                    }
                                >
                                    {termo.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Entregue por:</span>
                                    <p className="font-medium">{termo.responsavelEntrega}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Recebido por:</span>
                                    <p className="font-medium">{termo.responsavelRecebimento}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Itens Entregues:
                                </span>
                                <ul className="mt-2 space-y-1">
                                    {termo.itensEntregues.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {termo.observacao && (
                                <p className="text-sm text-muted-foreground mb-4">
                                    {termo.observacao}
                                </p>
                            )}

                            {termo.status === 'Assinado' && (
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t text-xs">
                                    <div>
                                        <p className="font-medium">Assinatura Escritório:</p>
                                        <p className="text-muted-foreground">
                                            {termo.assinaturaEscritorio}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Assinatura Cliente:</p>
                                        <p className="text-muted-foreground">
                                            {termo.assinaturaCliente}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
