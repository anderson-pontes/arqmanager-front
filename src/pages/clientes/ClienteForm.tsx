import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { mockClientes } from '@/data';
import { Save, X } from 'lucide-react';
import { isValidCPF, isValidCNPJ } from '@/utils/validators';

const enderecoSchema = z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres'),
    cep: z.string().min(8, 'CEP inválido'),
});

const clienteSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    razaoSocial: z.string().optional(),
    email: z.string().email('Email inválido'),
    identificacao: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    tipoPessoa: z.enum(['Física', 'Jurídica']),
    telefone: z.string().min(10, 'Telefone inválido'),
    whatsapp: z.string().optional(),
    dataNascimento: z.string().optional(),
    inscricaoEstadual: z.string().optional(),
    inscricaoMunicipal: z.string().optional(),
    indicadoPor: z.string().optional(),
    ativo: z.boolean(),
    endereco: enderecoSchema,
}).refine((data) => {
    if (data.tipoPessoa === 'Física') {
        return isValidCPF(data.identificacao);
    } else {
        return isValidCNPJ(data.identificacao);
    }
}, {
    message: 'CPF/CNPJ inválido',
    path: ['identificacao'],
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const cliente = isEdit ? mockClientes.find((c) => c.id === Number(id)) : null;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ClienteFormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: cliente
            ? {
                nome: cliente.nome,
                razaoSocial: cliente.razaoSocial,
                email: cliente.email,
                identificacao: cliente.identificacao,
                tipoPessoa: cliente.tipoPessoa,
                telefone: cliente.telefone,
                whatsapp: cliente.whatsapp,
                dataNascimento: cliente.dataNascimento,
                inscricaoEstadual: cliente.inscricaoEstadual,
                inscricaoMunicipal: cliente.inscricaoMunicipal,
                indicadoPor: cliente.indicadoPor,
                ativo: cliente.ativo,
                endereco: cliente.endereco,
            }
            : {
                ativo: true,
                tipoPessoa: 'Física',
                endereco: {
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    uf: '',
                    cep: '',
                },
            },
    });

    const ativo = watch('ativo');
    const tipoPessoa = watch('tipoPessoa');

    const onSubmit = async (data: ClienteFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Dados do cliente:', data);
            toast.success(isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
            navigate('/clientes');
        } catch (error) {
            toast.error('Erro ao salvar cliente');
        }
    };

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
                                    <Label htmlFor="tipoPessoa">
                                        Tipo de Pessoa <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value: 'Física' | 'Jurídica') => setValue('tipoPessoa', value)}
                                        defaultValue={cliente?.tipoPessoa || 'Física'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Física">Pessoa Física</SelectItem>
                                            <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="identificacao">
                                        {tipoPessoa === 'Física' ? 'CPF' : 'CNPJ'} <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="identificacao"
                                        placeholder={tipoPessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        {...register('identificacao')}
                                    />
                                    {errors.identificacao && (
                                        <p className="text-sm text-destructive">{errors.identificacao.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">
                                        {tipoPessoa === 'Física' ? 'Nome Completo' : 'Nome Fantasia'} <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="nome"
                                        placeholder={tipoPessoa === 'Física' ? 'Nome completo' : 'Nome fantasia'}
                                        {...register('nome')}
                                    />
                                    {errors.nome && (
                                        <p className="text-sm text-destructive">{errors.nome.message}</p>
                                    )}
                                </div>

                                {tipoPessoa === 'Jurídica' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="razaoSocial">Razão Social</Label>
                                        <Input id="razaoSocial" placeholder="Razão social" {...register('razaoSocial')} />
                                    </div>
                                )}

                                {tipoPessoa === 'Física' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                                        <Input id="dataNascimento" type="date" {...register('dataNascimento')} />
                                    </div>
                                )}
                            </div>

                            {tipoPessoa === 'Jurídica' && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                                        <Input id="inscricaoEstadual" placeholder="Inscrição estadual" {...register('inscricaoEstadual')} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                                        <Input id="inscricaoMunicipal" placeholder="Inscrição municipal" {...register('inscricaoMunicipal')} />
                                    </div>
                                </div>
                            )}
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
                                    <Label htmlFor="email">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone">
                                        Telefone <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="telefone" placeholder="(00) 00000-0000" {...register('telefone')} />
                                    {errors.telefone && (
                                        <p className="text-sm text-destructive">{errors.telefone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input id="whatsapp" placeholder="(00) 00000-0000" {...register('whatsapp')} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="indicadoPor">Indicado Por</Label>
                                    <Input id="indicadoPor" placeholder="Como conheceu o escritório" {...register('indicadoPor')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Endereço</CardTitle>
                            <CardDescription>Endereço completo do cliente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="logradouro">
                                        Logradouro <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="logradouro" placeholder="Rua, Avenida, etc." {...register('endereco.logradouro')} />
                                    {errors.endereco?.logradouro && (
                                        <p className="text-sm text-destructive">{errors.endereco.logradouro.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numero">
                                        Número <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="numero" placeholder="123" {...register('endereco.numero')} />
                                    {errors.endereco?.numero && (
                                        <p className="text-sm text-destructive">{errors.endereco.numero.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="complemento">Complemento</Label>
                                    <Input id="complemento" placeholder="Apto, Sala, etc." {...register('endereco.complemento')} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bairro">
                                        Bairro <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="bairro" placeholder="Bairro" {...register('endereco.bairro')} />
                                    {errors.endereco?.bairro && (
                                        <p className="text-sm text-destructive">{errors.endereco.bairro.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="cidade">
                                        Cidade <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="cidade" placeholder="Cidade" {...register('endereco.cidade')} />
                                    {errors.endereco?.cidade && (
                                        <p className="text-sm text-destructive">{errors.endereco.cidade.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="uf">
                                        UF <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="uf" placeholder="SP" maxLength={2} {...register('endereco.uf')} />
                                    {errors.endereco?.uf && (
                                        <p className="text-sm text-destructive">{errors.endereco.uf.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cep">
                                        CEP <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="cep" placeholder="00000-000" {...register('endereco.cep')} />
                                    {errors.endereco?.cep && (
                                        <p className="text-sm text-destructive">{errors.endereco.cep.message}</p>
                                    )}
                                </div>
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
