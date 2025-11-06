import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockContasBancarias, mockCategorias, mockProjetos } from '@/data';
import type { TipoReceita } from '@/types';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ReceitaFormData {
    tipoReceita: TipoReceita;
    descricao: string;
    valor: number;
    data: string;
    categoriaId: number;
    contaId: number;
    formaPagamento: string;
    status: 'Pendente' | 'Pago';
    projetoId?: number;
    dataPagamento?: string;
    observacao?: string;
    recorrente: boolean;
}

export function ReceitaForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categorias = mockCategorias.filter((c) => c.tipo === 'Receita' && c.ativo);
    const contas = mockContasBancarias.filter((c) => c.ativo);
    const projetos = mockProjetos;

    const { register, handleSubmit, setValue, watch } = useForm<ReceitaFormData>({
        defaultValues: {
            tipoReceita: 'Nova Receita',
            status: 'Pendente',
            recorrente: false,
        },
    });

    const tipoReceita = watch('tipoReceita');
    const status = watch('status');
    const recorrente = watch('recorrente');

    const onSubmit = async (data: ReceitaFormData) => {
        setIsSubmitting(true);
        try {
            console.log('Receita:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Receita cadastrada com sucesso!');
            navigate('/financeiro/movimentacoes');
        } catch (error) {
            console.error('Erro ao salvar receita:', error);
            toast.error('Erro ao salvar receita');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tiposReceita: TipoReceita[] = [
        'Novo Projeto',
        'Confirmação de Projeto',
        'Nova Receita',
        'Confirmar Receita',
    ];

    return (
        <div>
            <PageHeader title="Nova Receita" description="Cadastre uma nova receita no sistema" />

            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="tipoReceita">Tipo de Receita *</Label>
                                <Select
                                    onValueChange={(value) => setValue('tipoReceita', value as TipoReceita)}
                                    defaultValue="Nova Receita"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposReceita.map((tipo) => (
                                            <SelectItem key={tipo} value={tipo}>
                                                {tipo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    onValueChange={(value) => setValue('status', value as 'Pendente' | 'Pago')}
                                    defaultValue="Pendente"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Pago">Pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {(tipoReceita === 'Confirmação de Projeto' || tipoReceita === 'Confirmar Receita') && (
                            <div className="space-y-2">
                                <Label htmlFor="projetoId">Projeto *</Label>
                                <Select onValueChange={(value) => setValue('projetoId', Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o projeto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projetos.map((projeto) => (
                                            <SelectItem key={projeto.id} value={projeto.id.toString()}>
                                                {projeto.numero} - {projeto.cliente.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição *</Label>
                            <Input
                                id="descricao"
                                placeholder="Ex: Pagamento projeto residencial"
                                {...register('descricao')}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor *</Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    {...register('valor', { valueAsNumber: true })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="data">Data de Vencimento *</Label>
                                <Input id="data" type="date" {...register('data')} required />
                            </div>

                            {status === 'Pago' && (
                                <div className="space-y-2">
                                    <Label htmlFor="dataPagamento">Data de Pagamento</Label>
                                    <Input id="dataPagamento" type="date" {...register('dataPagamento')} />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="categoriaId">Categoria *</Label>
                                <Select
                                    onValueChange={(value) => setValue('categoriaId', Number(value))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contaId">Conta *</Label>
                                <Select onValueChange={(value) => setValue('contaId', Number(value))} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contas.map((conta) => (
                                            <SelectItem key={conta.id} value={conta.id.toString()}>
                                                {conta.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                                <Select
                                    onValueChange={(value) => setValue('formaPagamento', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                        <SelectItem value="PIX">PIX</SelectItem>
                                        <SelectItem value="Transferência">Transferência</SelectItem>
                                        <SelectItem value="Boleto">Boleto</SelectItem>
                                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                        <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                                        <SelectItem value="Cheque">Cheque</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacao">Observação</Label>
                            <Textarea
                                id="observacao"
                                placeholder="Informações adicionais sobre a receita"
                                className="resize-none"
                                rows={3}
                                {...register('observacao')}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="recorrente"
                                checked={recorrente}
                                onCheckedChange={(checked) => setValue('recorrente', checked as boolean)}
                            />
                            <Label htmlFor="recorrente" className="cursor-pointer">
                                Receita recorrente
                            </Label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/financeiro/movimentacoes')}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? 'Salvando...' : 'Salvar Receita'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
