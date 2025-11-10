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
import { colaboradoresService } from '@/api/services/colaboradores.service';
import { Save, X } from 'lucide-react';
import { maskCPF, maskPhone } from '@/utils/masks';

const colaboradorSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z.string().optional().refine((val) => !val || val.length === 0 || (val.replace(/\D/g, '').length === 11), {
        message: 'CPF deve ter 11 dígitos'
    }),
    telefone: z.string().optional(),
    data_nascimento: z.string().optional(),
    perfil: z.enum(['Administrador', 'Coordenador de Projetos', 'Produção']),
    tipo: z.enum(['Geral', 'Terceirizado']),
    ativo: z.boolean(),
    senha: z.string().optional(),
    // Dados Bancários (opcionais por enquanto)
    tipo_pix: z.string().optional(),
    chave_pix: z.string().optional(),
});

type ColaboradorForm = z.infer<typeof colaboradorSchema>;

export function ColaboradorForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ColaboradorForm>({
        resolver: zodResolver(colaboradorSchema),
        defaultValues: {
            ativo: true,
            perfil: 'Produção',
            tipo: 'Geral',
            tipo_pix: '',
            chave_pix: '',
        },
    });

    const perfil = watch('perfil');
    const tipo = watch('tipo');
    const tipoPix = watch('tipo_pix');

    // Buscar colaborador se for edição
    useEffect(() => {
        if (isEdit && id) {
            fetchColaborador();
        }
    }, [isEdit, id]);

    const fetchColaborador = async () => {
        try {
            setLoading(true);
            const colaborador = await colaboradoresService.getById(Number(id));
            
            // Preencher formulário com dados do colaborador
            setValue('nome', colaborador.nome);
            setValue('email', colaborador.email);
            setValue('cpf', colaborador.cpf);
            setValue('telefone', colaborador.telefone || '');
            setValue('data_nascimento', colaborador.data_nascimento || '');
            setValue('perfil', colaborador.perfil);
            setValue('tipo', colaborador.tipo);
            setValue('ativo', colaborador.ativo);
            setValue('tipo_pix', colaborador.tipo_pix || '');
            setValue('chave_pix', colaborador.chave_pix || '');
        } catch (error: any) {
            console.error('Erro ao buscar colaborador:', error);
            toast.error('Erro ao carregar dados do colaborador');
            navigate('/colaboradores');
        } finally {
            setLoading(false);
        }
    };

    const ativo = watch('ativo');

    const onSubmit = async (data: ColaboradorForm) => {
        try {
            // Remover máscaras do CPF
            const cpfLimpo = data.cpf.replace(/\D/g, '');
            
            if (isEdit && id) {
                // Atualizar
                const updateData = {
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    data_nascimento: data.data_nascimento || undefined,
                    perfil: data.perfil,
                    tipo: data.tipo,
                    ativo: data.ativo,
                    tipo_pix: data.tipo_pix || undefined,
                    chave_pix: data.chave_pix || undefined,
                    foto: undefined, // TODO: Implementar upload de foto
                };
                await colaboradoresService.update(Number(id), updateData);
            } else {
                // Criar
                if (!data.senha) {
                    toast.error('Senha é obrigatória para novos colaboradores');
                    return;
                }
                const createData = {
                    nome: data.nome,
                    email: data.email,
                    cpf: cpfLimpo && cpfLimpo.length === 11 ? cpfLimpo : undefined,
                    telefone: data.telefone || undefined,
                    data_nascimento: data.data_nascimento || undefined,
                    perfil: data.perfil,
                    tipo: data.tipo,
                    senha: data.senha!,
                    tipo_pix: data.tipo_pix || undefined,
                    chave_pix: data.chave_pix || undefined,
                };
                await colaboradoresService.create(createData);
            }

            toast.success(
                isEdit
                    ? 'Colaborador atualizado com sucesso!'
                    : 'Colaborador cadastrado com sucesso!'
            );

            navigate('/colaboradores');
        } catch (err: any) {
            console.error('Erro ao salvar colaborador:', err);
            const errorMessage = err.response?.data?.detail || 'Erro ao salvar colaborador';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader
                    title="Editar Colaborador"
                    description="Carregando dados..."
                    showBack
                />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
                description={
                    isEdit
                        ? 'Atualize os dados do colaborador'
                        : 'Cadastre um novo colaborador no sistema'
                }
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Dados Pessoais */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Dados Pessoais</CardTitle>
                            <CardDescription>
                                Informações básicas do colaborador
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">
                                    Nome Completo <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nome"
                                    placeholder="Nome completo"
                                    {...register('nome')}
                                />
                                {errors.nome && (
                                    <p className="text-sm text-destructive">
                                        {errors.nome.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo">
                                    Tipo <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={tipo}
                                    onValueChange={(value) =>
                                        setValue('tipo', value as 'Geral' | 'Terceirizado')
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Geral">Geral</SelectItem>
                                        <SelectItem value="Terceirizado">
                                            Terceirizado
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && (
                                    <p className="text-sm text-destructive">
                                        {errors.tipo.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpf">
                                    CPF <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    {...register('cpf')}
                                    onChange={(e) => {
                                        const masked = maskCPF(e.target.value);
                                        setValue('cpf', masked);
                                    }}
                                />
                                {errors.cpf && (
                                    <p className="text-sm text-destructive">
                                        {errors.cpf.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="data_nascimento">
                                    Data de Nascimento
                                </Label>
                                <Input
                                    id="data_nascimento"
                                    type="date"
                                    {...register('data_nascimento')}
                                />
                                {errors.data_nascimento && (
                                    <p className="text-sm text-destructive">
                                        {errors.data_nascimento.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contato */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Contato</CardTitle>
                            <CardDescription>
                                Informações de contato
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone">
                                    Telefone
                                </Label>
                                <Input
                                    id="telefone"
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                    {...register('telefone')}
                                    onChange={(e) => {
                                        const masked = maskPhone(e.target.value);
                                        setValue('telefone', masked);
                                    }}
                                />
                                {errors.telefone && (
                                    <p className="text-sm text-destructive">
                                        {errors.telefone.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados Bancários (Opcional por enquanto) */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dados Bancários (Opcional)</CardTitle>
                            <CardDescription>
                                Informações para pagamentos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo_pix">
                                        Tipo Pix
                                    </Label>
                                    <Select
                                        value={tipoPix || ''}
                                        onValueChange={(value) => setValue('tipo_pix', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="cpf">CPF</SelectItem>
                                            <SelectItem value="cnpj">CNPJ</SelectItem>
                                            <SelectItem value="telefone">Telefone</SelectItem>
                                            <SelectItem value="aleatoria">
                                                Chave Aleatória
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chave_pix">
                                        Chave PIX
                                    </Label>
                                    <Input
                                        id="chave_pix"
                                        placeholder="Chave PIX"
                                        {...register('chave_pix')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Acesso ao Sistema */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-2">
                        <CardHeader>
                            <CardTitle>Acesso ao Sistema</CardTitle>
                            <CardDescription>
                                Configurações de acesso e permissões
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="perfil">
                                        Perfil <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={perfil}
                                        onValueChange={(value) => setValue('perfil', value as 'Administrador' | 'Coordenador de Projetos' | 'Produção')}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o perfil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Administrador">
                                                Administrador
                                            </SelectItem>
                                            <SelectItem value="Coordenador de Projetos">
                                                Coordenador de Projetos
                                            </SelectItem>
                                            <SelectItem value="Produção">
                                                Produção
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.perfil && (
                                        <p className="text-sm text-destructive">
                                            {errors.perfil.message}
                                        </p>
                                    )}
                                </div>

                                {!isEdit && (
                                    <div className="space-y-2">
                                        <Label htmlFor="senha">
                                            Senha Inicial{' '}
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="senha"
                                            type="password"
                                            placeholder="Senha inicial (mínimo 6 caracteres)"
                                            {...register('senha', { required: !isEdit })}
                                        />
                                        {errors.senha && (
                                            <p className="text-sm text-destructive">
                                                {errors.senha.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="ativo">Status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {ativo
                                            ? 'Colaborador ativo no sistema'
                                            : 'Colaborador inativo'}
                                    </p>
                                </div>
                                <Switch
                                    id="ativo"
                                    checked={ativo}
                                    onCheckedChange={(checked) =>
                                        setValue('ativo', checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/colaboradores')}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting
                            ? 'Salvando...'
                            : isEdit
                                ? 'Atualizar'
                                : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
