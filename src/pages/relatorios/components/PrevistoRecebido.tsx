import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { mockFaturamentoMensal } from '@/data';
import { formatCurrency } from '@/utils/formatters';

interface PrevistoRecebidoProps {
    ano: string;
}

export function PrevistoRecebido({ ano }: PrevistoRecebidoProps) {
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
                    <p className="text-sm font-semibold mt-1">
                        Diferença: {formatCurrency(payload[1].value - payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Previsto × Recebido - Análise Mensal {ano}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={dados}>
                        <defs>
                            <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorRecebido" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="previsto"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorPrevisto)"
                            name="Previsto"
                        />
                        <Area
                            type="monotone"
                            dataKey="recebido"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorRecebido)"
                            name="Recebido"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
