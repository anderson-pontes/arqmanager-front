import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockComparativoAnual } from '@/data';
import { formatCurrency } from '@/utils/formatters';

interface ComparativoMensalProps {
    ano: string;
}

export function ComparativoMensal({ ano }: ComparativoMensalProps) {
    const dados = mockComparativoAnual;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.ano}</p>
                    <p className="text-sm text-green-600">
                        Receitas: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-sm text-red-600">
                        Despesas: {formatCurrency(payload[1].value)}
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">
                        Lucro: {formatCurrency(payload[2].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comparativo Anual - Evolução Histórica</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ano" />
                        <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="receitas"
                            stroke="#10B981"
                            strokeWidth={3}
                            name="Receitas"
                            dot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="despesas"
                            stroke="#EF4444"
                            strokeWidth={3}
                            name="Despesas"
                            dot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="lucro"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            name="Lucro"
                            dot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
