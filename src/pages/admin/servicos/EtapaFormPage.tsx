import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TinyMCEEditor } from '@/components/ui/tinymce-editor';
import { servicoService, etapaService } from '@/api/services/servico.service';
import type { Servico, Etapa } from '@/types';
import type { EtapaCreate, EtapaUpdate } from '@/api/services/servico.service';
import { toast } from 'sonner';

const etapaSchema = z.object({
    servico_id: z.number().min(1, 'Serviço é obrigatório'),
    nome: z.string().min(1, 'Nome é obrigatório').max(500, 'Nome muito longo'),
    descricao: z.string().optional(),
    descricao_contrato: z.string().optional(),
    ordem: z.number().int().min(0, 'Ordem deve ser um número positivo'),
    obrigatoria: z.boolean().default(true),
});

type EtapaFormData = z.infer<typeof etapaSchema>;

export function EtapaFormPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Pegar etapa e serviço do state da navegação
    const etapaEditando = location.state?.etapa as Etapa | undefined;
    const servicoFromState = location.state?.servico as Servico | undefined;

    const form = useForm<EtapaFormData>({
        resolver: zodResolver(etapaSchema),
        defaultValues: {
            servico_id: servicoFromState?.id || etapaEditando?.servico_id || 0,
            nome: '',
            descricao: '',
            descricao_contrato: '',
            ordem: 0,
            obrigatoria: true,
        },
    });

    useEffect(() => {
        loadServicos();
    }, []);

    useEffect(() => {
        if (etapaEditando) {
            const servico = servicoFromState || servicos.find(s => s.id === etapaEditando.servico_id);
            if (servico) {
                form.reset({
                    servico_id: servico.id,
                    nome: etapaEditando.nome,
                    descricao: etapaEditando.descricao || '',
                    descricao_contrato: etapaEditando.descricao_contrato || '',
                    ordem: etapaEditando.ordem,
                    obrigatoria: etapaEditando.obrigatoria,
                });
            }
        } else if (servicoFromState) {
            form.reset({
                servico_id: servicoFromState.id,
                nome: '',
                descricao: '',
                descricao_contrato: '',
                ordem: 0,
                obrigatoria: true,
            });
        }
    }, [etapaEditando, servicoFromState, servicos, form]);

    const loadServicos = async () => {
        try {
            const data = await servicoService.list({ ativo: true });
            setServicos(data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            toast.error('Erro ao carregar serviços');
        }
    };

    const handleSubmit = async (data: EtapaFormData) => {
        try {
            setLoading(true);
            
            if (etapaEditando) {
                const servico = servicoFromState || servicos.find(s => s.id === etapaEditando.servico_id);
                if (!servico) {
                    toast.error('Serviço não encontrado');
                    return;
                }
                // Atualizar
                await etapaService.update(servico.id, etapaEditando.id, data as EtapaUpdate);
                toast.success('Etapa atualizada com sucesso');
            } else {
                // Criar
                await etapaService.create(data.servico_id, data as EtapaCreate);
                toast.success('Etapa criada com sucesso');
            }
            
            navigate('/servicos/etapas');
        } catch (error) {
            console.error('Erro ao salvar etapa:', error);
            toast.error('Erro ao salvar etapa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={etapaEditando ? 'Editar Etapa' : 'Nova Etapa'}
                description={etapaEditando ? 'Altere as informações da etapa' : 'Adicione uma nova etapa para um serviço'}
                actions={
                    <Button
                        variant="outline"
                        onClick={() => navigate('/servicos/etapas')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                }
            />

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="servico_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serviço *</FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            disabled={!!etapaEditando}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um serviço" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {servicos.map((servico) => (
                                                    <SelectItem key={servico.id} value={String(servico.id)}>
                                                        {servico.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {etapaEditando ? 'O serviço não pode ser alterado' : 'Selecione o serviço ao qual esta etapa pertence'}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="descricao_contrato"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição para Contrato</FormLabel>
                                        <FormControl>
                                            <TinyMCEEditor
                                                content={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Digite a descrição que aparecerá no contrato..."
                                                className="min-h-[300px]"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Esta descrição será usada nos contratos. Use formatação rica (negrito, itálico, listas).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/servicos/etapas')}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? 'Salvando...'
                                        : etapaEditando
                                        ? 'Atualizar'
                                        : 'Criar'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

