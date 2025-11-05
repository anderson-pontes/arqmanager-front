import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { mockFaturamentoPorProjeto, mockFaturamentoPorCliente } from '@/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FaturamentoPorProjetoProps {
    ano: string;
}

export function FaturamentoPorProjeto({ ano }: FaturamentoPorProjetoProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-1">{payload[0].payload.cliente}</p>
                    <p className="text-sm">
                        {payload[0].payload.projetos} projeto(s)
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Faturamento por Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockFaturamentoPorProjeto.map((projeto, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold">{projeto.projeto}</p>
                                        <Badge
                                            className={
                                                projeto.status === 'Concluído'
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'
                                            }
                                        >
                                            {projeto.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {projeto.cliente}
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-green-600">
                                    {formatCurrency(projeto.valor)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Faturamento por Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={mockFaturamentoPorCliente} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                            />
                            <YAxis dataKey="cliente" type="category" width={120} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="valorTotal" fill="#10B981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
