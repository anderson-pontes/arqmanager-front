import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DollarSign } from 'lucide-react';
import type { Projeto } from '@/types';

interface ProjetoPagamentosProps {
    projeto: Projeto;
}

export function ProjetoPagamentos({ projeto }: ProjetoPagamentosProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pagamentos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {projeto.pagamentos.map((pag) => (
                        <div key={pag.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-medium">{pag.descricao}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {pag.formaPagamento}
                                    </p>
                                </div>
                                <Badge
                                    className={
                                        pag.status === 'Pago'
                                            ? 'bg-green-500'
                                            : pag.status === 'Pendente'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                    }
                                >
                                    {pag.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Valor:</span>
                                    <p className="font-semibold">{formatCurrency(pag.valor)}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Previsão:</span>
                                    <p>{formatDate(pag.dataPrevisao)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
