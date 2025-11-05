import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, getInitials } from '@/utils/formatters';
import {
    Building2,
    Calendar,
    DollarSign,
    Users,
    FileText,
    MapPin,
} from 'lucide-react';
import type { Projeto } from '@/types';

interface ProjetoResumoProps {
    projeto: Projeto;
}

export function ProjetoResumo({ projeto }: ProjetoResumoProps) {
    const progressoPagamento =
        (projeto.valorContrato - projeto.saldoContrato) / projeto.valorContrato * 100;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Informações Gerais */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Informações Gerais
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Número
                        </label>
                        <p className="text-lg font-semibold">{projeto.numero}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Cliente
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{projeto.cliente.nome}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Serviço
                        </label>
                        <p className="font-medium">{projeto.servico.nome}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Status
                        </label>
                        <div className="mt-1">
                            <Badge>{projeto.status}</Badge>
                        </div>
                    </div>

                    {projeto.metragem && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Metragem
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{projeto.metragem} m²</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Descrição
                        </label>
                        <p className="text-sm mt-1">{projeto.descricao}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Datas e Prazos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Datas e Prazos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Data de Início
                        </label>
                        <p className="font-medium">{formatDate(projeto.dataInicio)}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Previsão de Término
                        </label>
                        <p className="font-medium">
                            {formatDate(projeto.dataPrevisaoFim)}
                        </p>
                    </div>

                    {projeto.dataFim && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Data de Conclusão
                            </label>
                            <p className="font-medium text-green-600">
                                {formatDate(projeto.dataFim)}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Duração Prevista
                        </label>
                        <p className="font-medium">
                            {Math.ceil(
                                (new Date(projeto.dataPrevisaoFim).getTime() -
                                    new Date(projeto.dataInicio).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            dias
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Valores */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Valores
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Valor do Contrato
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(projeto.valorContrato)}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Valor Recebido
                        </label>
                        <p className="text-lg font-semibold">
                            {formatCurrency(projeto.valorContrato - projeto.saldoContrato)}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            Saldo a Receber
                        </label>
                        <p className="text-lg font-semibold text-orange-600">
                            {formatCurrency(projeto.saldoContrato)}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Progresso de Pagamento
                        </label>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{progressoPagamento.toFixed(1)}%</span>
                                <span className="text-muted-foreground">
                                    {projeto.pagamentos.filter((p) => p.status === 'Pago')
                                        .length}{' '}
                                    de {projeto.pagamentos.length} parcelas
                                </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-600 transition-all"
                                    style={{ width: `${progressoPagamento}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Equipe */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Equipe do Projeto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {projeto.equipe.map((colaborador) => (
                            <div
                                key={colaborador.id}
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {getInitials(colaborador.nome)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{colaborador.nome}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {colaborador.perfil}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
