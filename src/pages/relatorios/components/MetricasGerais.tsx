import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    FileText,
    CheckCircle,
    Clock,
    Target,
    Percent,
} from 'lucide-react';
import { mockMetricasGerais } from '@/data';

interface MetricasGeraisProps {
    ano: string;
}

export function MetricasGerais({ ano }: MetricasGeraisProps) {
    const metricas = mockMetricasGerais;

    const cards = [
        {
            title: 'Faturamento Total',
            value: formatCurrency(metricas.faturamentoTotal2024),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            trend: `+${metricas.taxaCrescimento}%`,
            trendUp: true,
        },
        {
            title: 'Faturamento Médio',
            value: formatCurrency(metricas.faturamentoMedio),
            subtitle: 'por mês',
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Ticket Médio',
            value: formatCurrency(metricas.ticketMedio),
            subtitle: 'por projeto',
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Projetos Finalizados',
            value: metricas.projetosFinalizados,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Projetos em Andamento',
            value: metricas.projetosEmAndamento,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Margem de Lucro',
            value: `${metricas.margemLucro}%`,
            icon: Percent,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
            trend: 'Excelente',
            trendUp: true,
        },
        {
            title: 'Receitas Pendentes',
            value: formatCurrency(metricas.receitasPendentes),
            icon: TrendingUp,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        {card.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                        )}
                        {card.trend && (
                            <div className="flex items-center gap-1 mt-2">
                                {card.trendUp ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span
                                    className={`text-xs font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {card.trend}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
