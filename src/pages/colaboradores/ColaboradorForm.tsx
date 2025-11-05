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
import { mockColaboradores } from '@/data';
import { Save, X } from 'lucide-react';
import { maskCPF, maskPhone } from '@/utils/masks';

const colaboradorSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z.string().min(14, 'CPF inválido').max(14, 'CPF inválido'),
    telefone: z.string().min(14, 'Telefone inválido'),
    dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    perfil: z.string().min(1, 'Perfil é obrigatório'),
    tipo: z.enum(['Geral', 'Terceirizado']).refine((val) => val !== undefined, {
        message: 'Tipo é obrigatório',
    }),
    ativo: z.boolean(),
    senha: z.string().optional(),
    // Dados Bancários
    socio: z.string().min(1, 'Selecione se é sócio'),
    tipoPix: z.string().min(1, 'Tipo de chave PIX é obrigatório'),
    chavePix: z.string().min(1, 'Chave PIX é obrigatória'),
});

type ColaboradorForm = z.infer<typeof colaboradorSchema>;

export function ColaboradorForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    // Buscar colaborador se for edição
    const colaborador = isEdit
        ? mockColaboradores.find((c) => c.id === Number(id))
        : null;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ColaboradorForm>({
        resolver: zodResolver(colaboradorSchema),
        defaultValues: colaborador
            ? {
                nome: colaborador.nome,
                email: colaborador.email,
                cpf: colaborador.cpf,
                telefone: colaborador.telefone,
                dataNascimento: colaborador.dataNascimento,
                perfil: colaborador.perfil,
                tipo: colaborador.tipo || 'Geral',
                ativo: colaborador.ativo,
                socio: colaborador.socio || 'nao',
                tipoPix: colaborador.tipoPix || '',
                chavePix: colaborador.chavePix || '',
            }
            : {
                ativo: true,
            },
    });

    const ativo = watch('ativo');

    const onSubmit = async (data: ColaboradorForm) => {
        try {
            // TODO: Implementar chamada à API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log('Dados do colaborador:', data);

            toast.success(
                isEdit
                    ? 'Colaborador atualizado com sucesso!'
                    : 'Colaborador cadastrado com sucesso!'
            );

            navigate('/colaboradores');
        } catch (err) {
            toast.error('Erro ao salvar colaborador');
            console.error(err);
        }
    };

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
                                    onValueChange={(value) =>
                                        setValue('tipo', value as 'Geral' | 'Terceirizado')
                                    }
                                    defaultValue={colaborador?.tipo}
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
                                <Label htmlFor="dataNascimento">
                                    Data de Nascimento{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="dataNascimento"
                                    type="date"
                                    {...register('dataNascimento')}
                                />
                                {errors.dataNascimento && (
                                    <p className="text-sm text-destructive">
                                        {errors.dataNascimento.message}
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
                                    Telefone <span className="text-destructive">*</span>
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

                    {/* Dados Bancários */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dados Bancários</CardTitle>
                            <CardDescription>
                                Informações para pagamentos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="socio">
                                        Sócio <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setValue('socio', value)}
                                        defaultValue={colaborador ? 'nao' : undefined}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sim">Sim</SelectItem>
                                            <SelectItem value="nao">Não</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.socio && (
                                        <p className="text-sm text-destructive">
                                            {errors.socio.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoPix">
                                        Tipo Pix <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setValue('tipoPix', value)}
                                        defaultValue={colaborador?.tipoPix}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
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
                                    {errors.tipoPix && (
                                        <p className="text-sm text-destructive">
                                            {errors.tipoPix.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chavePix">
                                        Chave PIX <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="chavePix"
                                        placeholder="Chave PIX"
                                        {...register('chavePix')}
                                    />
                                    {errors.chavePix && (
                                        <p className="text-sm text-destructive">
                                            {errors.chavePix.message}
                                        </p>
                                    )}
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
                                        onValueChange={(value) => setValue('perfil', value)}
                                        defaultValue={colaborador?.perfil}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o perfil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Administrador">
                                                Administrador
                                            </SelectItem>
                                            <SelectItem value="Arquiteto">
                                                Coordenador de Projetos
                                            </SelectItem>
                                            <SelectItem value="Designer">
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
                                            placeholder="Senha inicial"
                                            {...register('senha')}
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
