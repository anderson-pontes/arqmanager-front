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
import type { Servico, Etapa } from '@/types';
import type { EtapaCreate, EtapaUpdate } from '@/api/services/servico.service';

const etapaSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(500, 'Nome muito longo'),
    descricao: z.string().optional(),
    ordem: z.number().int().min(0, 'Ordem deve ser um número positivo'),
    obrigatoria: z.boolean().default(true),
});

type EtapaFormData = z.infer<typeof etapaSchema>;

interface EtapaFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    servico: Servico;
    etapa?: Etapa | null;
    onSubmit: (data: EtapaCreate | EtapaUpdate) => Promise<void>;
    loading?: boolean;
}

export function EtapaForm({
    open,
    onOpenChange,
    servico,
    etapa,
    onSubmit,
    loading = false,
}: EtapaFormProps) {
    const form = useForm<EtapaFormData>({
        resolver: zodResolver(etapaSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            ordem: 0,
            obrigatoria: true,
        },
    });

    useEffect(() => {
        if (etapa) {
            form.reset({
                nome: etapa.nome,
                descricao: etapa.descricao || '',
                ordem: etapa.ordem,
                obrigatoria: etapa.obrigatoria,
            });
        } else {
            form.reset({
                nome: '',
                descricao: '',
                ordem: 0,
                obrigatoria: true,
            });
        }
    }, [etapa, form]);

    const handleSubmit = async (data: EtapaFormData) => {
        await onSubmit(data);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {etapa ? 'Editar Etapa' : 'Nova Etapa'}
                    </DialogTitle>
                    <DialogDescription>
                        {etapa
                            ? 'Altere as informações da etapa'
                            : `Adicione uma nova etapa para o serviço "${servico.nome}"`}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Etapa *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Entrega 1 (ANTE PROJETO), Entrega 2 (Imagens)"
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
                                            Ordem cronológica das etapas
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="obrigatoria"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-end">
                                        <FormLabel>Exibir para Cliente</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {field.value
                                                ? 'Etapa será exibida para o cliente'
                                                : 'Etapa não será exibida para o cliente'}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição detalhada da etapa"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                    : etapa
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

