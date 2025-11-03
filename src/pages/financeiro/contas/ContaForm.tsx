import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { mockContasBancarias } from '@/data';
import { Save, X } from 'lucide-react';

export function ContaForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const conta = isEdit ? mockContasBancarias.find((c) => c.id === Number(id)) : null;

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: conta || { ativo: true, tipo: 'Corrente', cor: '#FBB040' },
    });

    const ativo = watch('ativo');

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(isEdit ? 'Conta atualizada!' : 'Conta cadastrada!');
        navigate('/financeiro/contas');
    };

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Conta' : 'Nova Conta'}
                description="Cadastre ou edite uma conta bancária"
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Dados da Conta</CardTitle>
                        <CardDescription>Informações da conta bancária</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome da Conta *</Label>
                                <Input id="nome" {...register('nome')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="banco">Banco *</Label>
                                <Input id="banco" {...register('banco')} required />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="agencia">Agência</Label>
                                <Input id="agencia" {...register('agencia')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="conta">Conta</Label>
                                <Input id="conta" {...register('conta')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo *</Label>
                                <Select onValueChange={(value) => setValue('tipo', value)} defaultValue={conta?.tipo || 'Corrente'}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Corrente">Corrente</SelectItem>
                                        <SelectItem value="Poupança">Poupança</SelectItem>
                                        <SelectItem value="Investimento">Investimento</SelectItem>
                                        <SelectItem value="Caixa">Caixa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="saldoInicial">Saldo Inicial *</Label>
                                <Input id="saldoInicial" type="number" step="0.01" {...register('saldoInicial')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cor">Cor</Label>
                                <Input id="cor" type="color" {...register('cor')} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="ativo">Status da Conta</Label>
                                <p className="text-sm text-muted-foreground">{ativo ? 'Conta ativa' : 'Conta inativa'}</p>
                            </div>
                            <Switch id="ativo" checked={ativo} onCheckedChange={(checked) => setValue('ativo', checked)} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/financeiro/contas')}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
