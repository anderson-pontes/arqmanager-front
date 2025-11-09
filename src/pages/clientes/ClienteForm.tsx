import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, X, Loader2 } from 'lucide-react';
import { isValidCPF, isValidCNPJ } from '@/utils/validators';
import { useClientes } from '@/hooks/useClientes';
import { clientesService, type Cliente } from '@/api/services/clientes.service';

// Schema simplificado para corresponder à API
const clienteSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    cpf_cnpj: z.string().optional().or(z.literal('')),
    tipo_pessoa: z.enum(['fisica', 'juridica']),
    telefone: z.string().optional().or(z.literal('')),
    endereco: z.string().optional().or(z.literal('')),
    cidade: z.string().optional().or(z.literal('')),
    estado: z.string().optional().or(z.literal('')),
    cep: z.string().optional().or(z.literal('')),
    observacoes: z.string().optional().or(z.literal('')),
    ativo: z.boolean(),
}).refine((data) => {
    if (data.cpf_cnpj && data.cpf_cnpj.length > 0) {
        if (data.tipo_pessoa === 'fisica') {
            return isValidCPF(data.cpf_cnpj);
        } else {
            return isValidCNPJ(data.cpf_cnpj);
        }
    }
    return true;
}, {
    message: 'CPF/CNPJ inválido',
    path: ['cpf_cnpj'],
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loadingCliente, setLoadingCliente] = useState(isEdit);
    const { createCliente, updateCliente } = useClientes();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClienteFormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            ativo: true,
            tipo_pessoa: 'fisica',
            nome: '',
            email: '',
            cpf_cnpj: '',
            telefone: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            observacoes: '',
        },
    });

    const ativo = watch('ativo');
    const tipoPessoa = watch('tipo_pessoa');

    // Buscar dados do cliente se estiver editando
    useEffect(() => {
        if (isEdit && id) {
            const fetchCliente = async () => {
                try {
                    setLoadingCliente(true);
                    const data = await clientesService.getById(Number(id));
                    setCliente(data);

                    // Preencher o formulário com os dados do cliente
                    reset({
                        nome: data.nome,
                        email: data.email || '',
                        cpf_cnpj: data.cpf_cnpj || '',
                        tipo_pessoa: data.tipo_pessoa,
                        telefone: data.telefone || '',
                        endereco: data.endereco || '',
                        cidade: data.cidade || '',
                        estado: data.estado || '',
                        cep: data.cep || '',
                        observacoes: data.observacoes || '',
                        ativo: data.ativo,
                    });
                } catch (error: any) {
                    toast.error('Erro ao carregar dados do cliente');
                    console.error('Erro ao buscar cliente:', error);
                    navigate('/clientes');
                } finally {
                    setLoadingCliente(false);
                }
            };

            fetchCliente();
        }
    }, [id, isEdit, reset, navigate]);

    const onSubmit = async (data: ClienteFormData) => {
        try {
            // Limpar campos vazios
            const cleanData = {
                ...data,
                email: data.email || undefined,
                cpf_cnpj: data.cpf_cnpj || undefined,
                telefone: data.telefone || undefined,
                endereco: data.endereco || undefined,
                cidade: data.cidade || undefined,
                estado: data.estado || undefined,
                cep: data.cep || undefined,
                observacoes: data.observacoes || undefined,
            };

            if (isEdit && id) {
                await updateCliente(Number(id), cleanData);
                toast.success('Cliente atualizado com sucesso!');
            } else {
                await createCliente(cleanData);
                toast.success('Cliente cadastrado com sucesso!');
            }

            navigate('/clientes');
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao salvar cliente';
            toast.error(errorMessage);
            console.error('Erro ao salvar cliente:', error);
        }
    };

    if (loadingCliente) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                description={isEdit ? 'Atualize os dados do cliente' : 'Cadastre um novo cliente no sistema'}
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    {/* Dados Básicos */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Dados Básicos</CardTitle>
                            <CardDescription>Informações principais do cliente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo_pessoa">
                                        Tipo de Pessoa <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value: 'fisica' | 'juridica') => setValue('tipo_pessoa', value)}
                                        value={tipoPessoa}
                                        defaultValue={tipoPessoa}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fisica">Pessoa Física</SelectItem>
                                            <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf_cnpj">
                                        {tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                                    </Label>
                                    <Input
                                        id="cpf_cnpj"
                                        placeholder={tipoPessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        {...register('cpf_cnpj')}
                                    />
                                    {errors.cpf_cnpj && (
                                        <p className="text-sm text-destructive">{errors.cpf_cnpj.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nome">
                                    {tipoPessoa === 'fisica' ? 'Nome Completo' : 'Nome/Razão Social'} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nome"
                                    placeholder={tipoPessoa === 'fisica' ? 'Nome completo' : 'Nome ou razão social'}
                                    {...register('nome')}
                                />
                                {errors.nome && (
                                    <p className="text-sm text-destructive">{errors.nome.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contato */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Contato</CardTitle>
                            <CardDescription>Informações de contato</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input id="telefone" placeholder="(00) 00000-0000" {...register('telefone')} />
                                    {errors.telefone && (
                                        <p className="text-sm text-destructive">{errors.telefone.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Endereço</CardTitle>
                            <CardDescription>Endereço do cliente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço Completo</Label>
                                <Input
                                    id="endereco"
                                    placeholder="Rua, número, complemento"
                                    {...register('endereco')}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade</Label>
                                    <Input id="cidade" placeholder="Cidade" {...register('cidade')} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input id="estado" placeholder="SP" maxLength={2} {...register('estado')} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input id="cep" placeholder="00000-000" {...register('cep')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Observações */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Observações</CardTitle>
                            <CardDescription>Informações adicionais sobre o cliente</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="observacoes">Observações</Label>
                                <textarea
                                    id="observacoes"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Informações adicionais sobre o cliente..."
                                    {...register('observacoes')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="ativo">Status do Cliente</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {ativo ? 'Cliente ativo no sistema' : 'Cliente inativo'}
                                    </p>
                                </div>
                                <Switch id="ativo" checked={ativo} onCheckedChange={(checked) => setValue('ativo', checked)} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/clientes')}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
