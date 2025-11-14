import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Servico } from '@/types';
import type {
    ServicoCreate,
    ServicoUpdate,
} from '@/api/services/servico.service';

const servicoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(500, 'Nome muito longo'),
    descricao: z.string().optional(),
    descricao_contrato: z.string().optional(),
    valor_base: z.number().positive().optional().or(z.literal('')),
    unidade: z.string().max(50).optional(),
    codigo_plano_contas: z.string().max(50).optional(),
    ativo: z.boolean().default(true),
});

type ServicoFormData = z.infer<typeof servicoSchema>;

interface ServicoFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    servico?: Servico | null;
    onSubmit: (data: ServicoCreate | ServicoUpdate) => Promise<void>;
    loading?: boolean;
}

export function ServicoForm({
    open,
    onOpenChange,
    servico,
    onSubmit,
    loading = false,
}: ServicoFormProps) {
    const form = useForm<ServicoFormData>({
        resolver: zodResolver(servicoSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            descricao_contrato: '',
            valor_base: undefined,
            unidade: '',
            codigo_plano_contas: '',
            ativo: true,
        },
    });

    useEffect(() => {
        if (servico) {
            form.reset({
                nome: servico.nome,
                descricao: servico.descricao || '',
                descricao_contrato: servico.descricao_contrato || '',
                valor_base: servico.valor_base || undefined,
                unidade: servico.unidade || '',
                codigo_plano_contas: servico.codigo_plano_contas || '',
                ativo: servico.ativo,
            });
        } else {
            form.reset({
                nome: '',
                descricao: '',
                descricao_contrato: '',
                valor_base: undefined,
                unidade: '',
                codigo_plano_contas: '',
                ativo: true,
            });
        }
    }, [servico, form]);

    const handleSubmit = async (data: ServicoFormData) => {
        const submitData: ServicoCreate | ServicoUpdate = {
            ...data,
            valor_base: data.valor_base === '' ? undefined : data.valor_base,
        };
        await onSubmit(submitData);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {servico ? 'Editar Serviço' : 'Novo Serviço'}
                    </DialogTitle>
                    <DialogDescription>
                        {servico
                            ? 'Altere as informações do serviço'
                            : 'Preencha os dados para criar um novo serviço'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Serviço *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Arquitetura, Interior, Consultoria"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="codigo_plano_contas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código do Plano de Contas</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: 1.1.1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Código único para identificação no plano de contas
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição detalhada do serviço"
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
                            name="descricao_contrato"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição para Contrato</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição que aparecerá nos contratos"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="valor_base"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor Base</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(
                                                        value === '' ? '' : parseFloat(value)
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: m², unidade, hora"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="ativo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Ativo</FormLabel>
                                        <FormDescription>
                                            Serviços inativos não aparecerão nas listagens
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? 'Salvando...'
                                    : servico
                                    ? 'Atualizar'
                                    : 'Criar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

