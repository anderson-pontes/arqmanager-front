import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockContasBancarias, mockCategorias, mockProjetos } from '@/data';
import { Save, X } from 'lucide-react';

const despesaSchema = z.object({
    descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
    valor: z.string().min(1, 'Valor é obrigatório'),
    data: z.string().min(1, 'Data é obrigatória'),
    categoriaId: z.string().min(1, 'Categoria é obrigatória'),
    contaId: z.string().min(1, 'Conta é obrigatória'),
    formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
    status: z.enum(['Pendente', 'Pago']),
    recorrente: z.boolean(),
    projetoId: z.string().optional(),
    dataPagamento: z.string().optional(),
    observacao: z.string().optional(),
});

type DespesaFormData = z.infer<typeof despesaSchema>;

interface DespesaFormProps {
    defaultContaId?: number;
}

export function DespesaForm({ defaultContaId }: DespesaFormProps) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categorias = mockCategorias.filter((c) => c.tipo === 'Despesa' && c.ativo);
    const contas = mockContasBancarias.filter((c) => c.ativo);
    const projetos = mockProjetos;

    const form = useForm<DespesaFormData>({
        resolver: zodResolver(despesaSchema),
        defaultValues: {
            status: 'Pendente',
            recorrente: false,
        },
    });

    const status = form.watch('status');

    useEffect(() => {
        if (defaultContaId) {
            form.setValue('contaId', String(defaultContaId));
        }
    }, [defaultContaId]);

    const onSubmit = async (data: DespesaFormData) => {
        setIsSubmitting(true);
        try {
            console.log('Despesa:', data);
            setTimeout(() => {
                navigate('/financeiro/movimentacoes');
            }, 1000);
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Nova Despesa"
                description="Cadastre uma nova despesa no sistema"
            />

            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                                    <SelectItem value="Pago">Pago</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="projetoId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Projeto (Opcional)</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o projeto" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {projetos.map((projeto) => (
                                                        <SelectItem key={projeto.id} value={projeto.id.toString()}>
                                                            {projeto.numero} - {projeto.cliente.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Aluguel escritório" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="valor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor *</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0,00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="data"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Vencimento *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {status === 'Pago' && (
                                    <FormField
                                        control={form.control}
                                        name="dataPagamento"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de Pagamento</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="categoriaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoria *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categorias.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Conta *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {contas.map((conta) => (
                                                        <SelectItem key={conta.id} value={conta.id.toString()}>
                                                            {conta.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="formaPagamento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Forma de Pagamento *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                                    <SelectItem value="PIX">PIX</SelectItem>
                                                    <SelectItem value="Transferência">Transferência</SelectItem>
                                                    <SelectItem value="Boleto">Boleto</SelectItem>
                                                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                                    <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                                    <SelectItem value="Débito Automático">Débito Automático</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="observacao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observação</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Informações adicionais sobre a despesa"
                                                className="resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="recorrente"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Despesa recorrente</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/financeiro/movimentacoes')}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? 'Salvando...' : 'Salvar Despesa'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
