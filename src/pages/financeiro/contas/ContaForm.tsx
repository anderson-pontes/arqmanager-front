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
import { mockContasBancarias, mockColaboradores } from '@/data';
import { Save, X } from 'lucide-react';
import type { ContaBancaria } from '@/types';

export function ContaForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const conta = isEdit ? mockContasBancarias.find((c) => c.id === Number(id)) : null;

    const { register, handleSubmit, setValue, watch } = useForm<ContaBancaria>({
        defaultValues: conta || {
            ativo: true,
            tipo: 'Corrente',
            cor: '#FBB040',
            saldoInicial: 0,
            saldoAtual: 0,
        } as Partial<ContaBancaria>,
    });

    const ativo = watch('ativo');

    const onSubmit = async (data: ContaBancaria) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Dados da conta:', data);
            toast.success(isEdit ? 'Conta atualizada!' : 'Conta cadastrada!');
            navigate('/financeiro/contas');
        } catch (error) {
            console.error('Erro ao salvar conta:', error);
            toast.error('Erro ao salvar conta');
        }
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
                                <Select
                                    onValueChange={(value) =>
                                        setValue(
                                            'tipo',
                                            value as
                                            | 'Corrente'
                                            | 'Poupança'
                                            | 'Investimento'
                                            | 'Caixa'
                                            | 'Salário'
                                            | 'Outros'
                                        )
                                    }
                                    defaultValue={conta?.tipo || 'Corrente'}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Corrente">Corrente</SelectItem>
                                        <SelectItem value="Salário">Salário</SelectItem>
                                        <SelectItem value="Poupança">Poupança</SelectItem>
                                        <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="saldoInicial">Saldo Inicial *</Label>
                                <Input id="saldoInicial" type="number" step="0.01" {...register('saldoInicial')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataInicio">Data de Início</Label>
                                <Input id="dataInicio" type="date" {...register('dataInicio')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataEncerramento">Data de Encerramento</Label>
                                <Input id="dataEncerramento" type="date" {...register('dataEncerramento')} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="responsavel">Responsável</Label>
                                <Select onValueChange={(value) => setValue('responsavel', value)} defaultValue={conta?.responsavel}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o responsável" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockColaboradores.map((colaborador) => (
                                            <SelectItem key={colaborador.id} value={String(colaborador.id)}>
                                                {colaborador.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tipoPix">Tipo de PIX</Label>
                                <Select onValueChange={(value) => setValue('tipoPix', value)} defaultValue={conta?.tipoPix}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cpf">CPF</SelectItem>
                                        <SelectItem value="cnpj">CNPJ</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="telefone">Telefone</SelectItem>
                                        <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="chavePix">Chave PIX</Label>
                                <Input id="chavePix" placeholder="Chave PIX" {...register('chavePix')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cor">Cor</Label>
                            <Input id="cor" type="color" {...register('cor')} />
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
