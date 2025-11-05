import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    FileSpreadsheet,
    FileText,
} from 'lucide-react';
import { FaturamentoAnual } from './components/FaturamentoAnual';
import { ComparativoMensal } from './components/ComparativoMensal';
import { PrevistoRecebido } from './components/PrevistoRecebido';
import { ReceitasDespesas } from './components/ReceitasDespesas';
import { FaturamentoPorProjeto } from './components/FaturamentoPorProjeto';
import { MetricasGerais } from './components/MetricasGerais';

export function RelatoriosPage() {
    const [anoSelecionado, setAnoSelecionado] = useState('2024');
    const [periodoSelecionado, setPeriodoSelecionado] = useState('anual');

    const handleExportPDF = () => {
        console.log('Exportar PDF');
        // Implementar exportação PDF
    };

    const handleExportExcel = () => {
        console.log('Exportar Excel');
        // Implementar exportação Excel
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Relatórios e Gráficos"
                description="Análise financeira e indicadores de desempenho"
                actions={
                    <div className="flex gap-2">
                        <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={handleExportPDF}>
                            <FileText className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                        <Button variant="outline" onClick={handleExportExcel}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Excel
                        </Button>
                    </div>
                }
            />

            {/* Métricas Gerais */}
            <MetricasGerais ano={anoSelecionado} />

            {/* Tabs de Relatórios */}
            <Tabs defaultValue="faturamento" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="faturamento">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Faturamento
                    </TabsTrigger>
                    <TabsTrigger value="comparativo">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Comparativo
                    </TabsTrigger>
                    <TabsTrigger value="previsto">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Previsto × Recebido
                    </TabsTrigger>
                    <TabsTrigger value="categorias">
                        <PieChart className="mr-2 h-4 w-4" />
                        Por Categoria
                    </TabsTrigger>
                    <TabsTrigger value="projetos">
                        <FileText className="mr-2 h-4 w-4" />
                        Por Projeto
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="faturamento">
                    <FaturamentoAnual ano={anoSelecionado} />
                </TabsContent>

                <TabsContent value="comparativo">
                    <ComparativoMensal ano={anoSelecionado} />
                </TabsContent>

                <TabsContent value="previsto">
                    <PrevistoRecebido ano={anoSelecionado} />
                </TabsContent>

                <TabsContent value="categorias">
                    <ReceitasDespesas ano={anoSelecionado} />
                </TabsContent>

                <TabsContent value="projetos">
                    <FaturamentoPorProjeto ano={anoSelecionado} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
