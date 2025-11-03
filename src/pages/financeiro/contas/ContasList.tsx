import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Plus, Edit, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { mockContasBancarias } from '@/data';
import { formatCurrency } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

export function ContasList() {
    const navigate = useNavigate();
    const [contas] = useState(mockContasBancarias);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const saldoTotal = contas.reduce((acc, conta) => acc + conta.saldoAtual, 0);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        toast.success('Conta excluída com sucesso!');
        setDeleteDialogOpen(false);
    };

    return (
        <div>
            <PageHeader
                title="Contas Bancárias"
                description="Gerencie as contas bancárias do escritório"
                action={
                    <Button onClick={() => navigate('/financeiro/contas/novo')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Conta
                    </Button>
                }
            />

            {/* Resumo */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(saldoTotal)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {contas.filter((c) => c.ativo).length} contas ativas
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maior Saldo</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(Math.max(...contas.map((c) => c.saldoAtual)))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {contas.find((c) => c.saldoAtual === Math.max(...contas.map((c) => c.saldoAtual)))?.nome}
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menor Saldo</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(Math.min(...contas.map((c) => c.saldoAtual)))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {contas.find((c) => c.saldoAtual === Math.min(...contas.map((c) => c.saldoAtual)))?.nome}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Contas */}
            <div className="grid gap-6 md:grid-cols-2">
                {contas.map((conta) => (
                    <Card
                        key={conta.id}
                        className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => navigate(`/financeiro/contas/${conta.id}`)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: conta.cor + '20' }}
                                    >
                                        <Wallet className="h-6 w-6" style={{ color: conta.cor }} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{conta.nome}</CardTitle>
                                        <CardDescription>{conta.banco}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={conta.ativo ? 'default' : 'secondary'}>
                                    {conta.ativo ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Agência / Conta</span>
                                    <span className="font-medium">
                                        {conta.agencia} / {conta.conta}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Tipo</span>
                                    <Badge variant="outline">{conta.tipo}</Badge>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-muted-foreground">Saldo Atual</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatCurrency(conta.saldoAtual)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">Saldo Inicial</span>
                                        <span className="text-sm">{formatCurrency(conta.saldoInicial)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => navigate(`/financeiro/contas/${conta.id}/editar`)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(conta.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Conta"
                description="Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
            />
        </div>
    );
}
