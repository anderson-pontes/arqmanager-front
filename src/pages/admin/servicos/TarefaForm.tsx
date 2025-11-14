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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Servico, Etapa, Tarefa } from '@/types';
import type { TarefaCreate, TarefaUpdate } from '@/api/services/servico.service';

const tarefaSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(500, 'Nome muito longo'),
    ordem: z.number().int().min(0, 'Ordem deve ser um número positivo'),
    cor: z
        .string()
        .optional()
        .refine(
            (val) => !val || val === '' || /^#[0-9A-Fa-f]{3,6}$/i.test(val),
            'Cor deve estar no formato hexadecimal (#RGB ou #RRGGBB)'
        ),
    tem_prazo: z.boolean().default(true),
    precisa_detalhamento: z.boolean().default(false),
});

type TarefaFormData = z.infer<typeof tarefaSchema>;

interface TarefaFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    servico: Servico;
    etapa: Etapa;
    tarefa?: Tarefa | null;
    onSubmit: (data: TarefaCreate | TarefaUpdate) => Promise<void>;
    loading?: boolean;
}

export function TarefaForm({
    open,
    onOpenChange,
    servico,
    etapa,
    tarefa,
    onSubmit,
    loading = false,
}: TarefaFormProps) {
    const form = useForm<TarefaFormData>({
        resolver: zodResolver(tarefaSchema),
        defaultValues: {
            nome: '',
            ordem: 0,
            cor: '',
            tem_prazo: true,
            precisa_detalhamento: false,
        },
    });

    useEffect(() => {
        if (tarefa) {
            form.reset({
                nome: tarefa.nome,
                ordem: tarefa.ordem,
                cor: tarefa.cor || '',
                tem_prazo: tarefa.tem_prazo,
                precisa_detalhamento: tarefa.precisa_detalhamento,
            });
        } else {
            form.reset({
                nome: '',
                ordem: 0,
                cor: '',
                tem_prazo: true,
                precisa_detalhamento: false,
            });
        }
    }, [tarefa, form]);

    const handleSubmit = async (data: TarefaFormData) => {
        const submitData: TarefaCreate | TarefaUpdate = {
            ...data,
            cor: data.cor === '' ? undefined : data.cor,
        };
        await onSubmit(submitData);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </DialogTitle>
                    <DialogDescription>
                        {tarefa
                            ? 'Altere as informações da tarefa'
                            : `Adicione uma nova tarefa para a etapa "${etapa.nome}" do serviço "${servico.nome}"`}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Tarefa *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Layout, Planta Baixa, Imagem 3D"
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
                                name="ordem"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ordem *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                value={field.value || 0}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    field.onChange(value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Ordem cronológica da tarefa
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cor</FormLabel>
                                        <div className="flex items-center gap-2">
                                            <FormControl>
                                                <Input
                                                    type="color"
                                                    className="w-16 h-10"
                                                    {...field}
                                                    value={field.value || '#6366f1'}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <Input
                                                    placeholder="#RRGGBB"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormDescription className="text-xs">
                                            Cor para identificação visual (formato hexadecimal)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tem_prazo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Tem Prazo</FormLabel>
                                            <FormDescription className="text-xs">
                                                Esta tarefa tem prazo para ser entregue?
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

                            <FormField
                                control={form.control}
                                name="precisa_detalhamento"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Precisa Detalhamento
                                            </FormLabel>
                                            <FormDescription className="text-xs">
                                                Esta tarefa precisa especificar áreas/detalhes?
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
                        </div>

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
                                    : tarefa
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

