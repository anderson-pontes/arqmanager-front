import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockFaturamentoReceitas, mockFaturamentoDespesas } from '@/data';
import { formatCurrency } from '@/utils/formatters';

interface ReceitasDespesasProps {
    ano: string;
}

export function ReceitasDespesas({ ano }: ReceitasDespesasProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-1">{payload[0].name}</p>
                    <p className="text-sm">{formatCurrency(payload[0].value)}</p>
                    <p className="text-xs text-muted-foreground">
                        {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalReceitas = mockFaturamentoReceitas.reduce((acc, r) => acc + r.valor, 0);
    const totalDespesas = mockFaturamentoDespesas.reduce((acc, d) => acc + d.valor, 0);

    const receitasComTotal = mockFaturamentoReceitas.map((r) => ({
        ...r,
        total: totalReceitas,
    }));

    const despesasComTotal = mockFaturamentoDespesas.map((d) => ({
        ...d,
        total: totalDespesas,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Receitas por Categoria</CardTitle>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatCurrency(totalReceitas)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={receitasComTotal}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="valor"
                            >
                                {mockFaturamentoReceitas.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.cor} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 space-y-2">
                        {mockFaturamentoReceitas.map((receita, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: receita.cor }}
                                    />
                                    <span>{receita.categoria}</span>
                                </div>
                                <span className="font-semibold">
                                    {formatCurrency(receita.valor)}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Despesas por Categoria</CardTitle>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-red-600">
                                {formatCurrency(totalDespesas)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={despesasComTotal}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="valor"
                            >
                                {mockFaturamentoDespesas.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.cor} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 space-y-2">
                        {mockFaturamentoDespesas.map((despesa, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: despesa.cor }}
                                    />
                                    <span>{despesa.categoria}</span>
                                </div>
                                <span className="font-semibold">
                                    {formatCurrency(despesa.valor)}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
