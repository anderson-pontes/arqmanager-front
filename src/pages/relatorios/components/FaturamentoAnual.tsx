import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockFaturamentoMensal } from '@/data';
import { formatCurrency } from '@/utils/formatters';

interface FaturamentoAnualProps {
    ano: string;
}

export function FaturamentoAnual({ ano }: FaturamentoAnualProps) {
    const dados = mockFaturamentoMensal.filter((d) => d.ano === Number(ano));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.mes}</p>
                    <p className="text-sm text-blue-600">
                        Previsto: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-sm text-green-600">
                        Recebido: {formatCurrency(payload[1].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalPrevisto = dados.reduce((acc, d) => acc + d.previsto, 0);
    const totalRecebido = dados.reduce((acc, d) => acc + d.recebido, 0);
    const percentualRecebido = ((totalRecebido / totalPrevisto) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Faturamento Anual {ano}</CardTitle>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Recebido</p>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalRecebido)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {percentualRecebido}% do previsto
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="previsto" fill="#3B82F6" name="Previsto" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="recebido" fill="#10B981" name="Recebido" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
