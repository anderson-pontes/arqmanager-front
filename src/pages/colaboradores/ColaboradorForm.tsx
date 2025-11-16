import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { maskCPF, maskPhone, unmask } from '@/utils/masks';
import { colaboradoresService, type Colaborador } from '@/api/services/colaboradores.service';
import { useAuthStore } from '@/store/authStore';
import { SkeletonCard } from '@/components/common/SkeletonCard';

const colaboradorSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z.string().min(14, 'CPF inválido').max(14, 'CPF inválido'),
    telefone: z.string().min(14, 'Telefone inválido'),
    dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    ativo: z.boolean(),
    senha: z.string().optional(),
    // Dados Bancários
    socio: z.string().min(1, 'Selecione se é sócio'),
    tipoPix: z.string().min(1, 'Tipo de chave PIX é obrigatório'),
    chavePix: z.string().min(1, 'Chave PIX é obrigatória'),
    // Perfis
    perfis: z.array(z.string()).min(1, 'Selecione pelo menos um perfil'),
});

type ColaboradorForm = z.infer<typeof colaboradorSchema>;

const PERFIS_DISPONIVEIS = [
    'Administrador',
    'Coordenador de Projetos',
    'Financeiro',
    'Produção',
    'Terceirizado',
];

export function ColaboradorForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const { currentContext } = useAuthStore();
    const escritorioId = currentContext.escritorioId;

    const [colaborador, setColaborador] = useState<Colaborador | null>(null);
    const [perfisSelecionados, setPerfisSelecionados] = useState<string[]>([]);
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
            perfis: [],
        },
    });

    const ativo = watch('ativo');

    useEffect(() => {
        if (isEdit && id) {
            fetchColaborador();
        }
    }, [id, isEdit]);

    const fetchColaborador = async () => {
        try {
            setLoading(true);
            const data = await colaboradoresService.getById(Number(id));
            setColaborador(data);

            // Buscar perfis do colaborador
            try {
                const perfisData = await colaboradoresService.getPerfis(Number(id));
                const perfisAtivos = perfisData
                    .filter(p => p.ativo)
                    .map(p => p.perfil);
                setPerfisSelecionados(perfisAtivos);
                setValue('perfis', perfisAtivos);
            } catch (err) {
                console.error('Erro ao buscar perfis:', err);
            }

            // Preencher formulário
            setValue('nome', data.nome);
            setValue('email', data.email);
            // Aplicar máscara no CPF se existir
            setValue('cpf', data.cpf ? maskCPF(data.cpf) : '');
            // Aplicar máscara no telefone se existir
            setValue('telefone', data.telefone ? maskPhone(data.telefone) : '');
            setValue('dataNascimento', data.data_nascimento ? data.data_nascimento.split('T')[0] : '');
            setValue('ativo', data.ativo);
            setValue('tipoPix', data.tipo_pix || '');
            setValue('chavePix', data.chave_pix || '');
            setValue('socio', 'nao'); // TODO: buscar do backend se existir
        } catch (error: any) {
            console.error('Erro ao buscar colaborador:', error);
            toast.error('Erro ao carregar dados do colaborador');
            navigate('/colaboradores');
        } finally {
            setLoading(false);
        }
    };

    const handlePerfilToggle = (perfil: string) => {
        const novosPerfis = perfisSelecionados.includes(perfil)
            ? perfisSelecionados.filter(p => p !== perfil)
            : [...perfisSelecionados, perfil];
        
        setPerfisSelecionados(novosPerfis);
        setValue('perfis', novosPerfis);
    };

    const onSubmit = async (data: ColaboradorForm) => {
        if (!escritorioId) {
            toast.error('Escritório não selecionado');
            return;
        }

        try {
            if (isEdit && id) {
                // Atualizar colaborador
                const updateData: any = {
                    nome: data.nome,
                    email: data.email,
                    cpf: data.cpf ? unmask(data.cpf) : undefined,
                    telefone: data.telefone ? unmask(data.telefone) : undefined,
                    data_nascimento: data.dataNascimento,
                    ativo: data.ativo,
                    tipo_pix: data.tipoPix,
                    chave_pix: data.chavePix,
                };

                if (data.senha) {
                    updateData.senha = data.senha;
                }

                await colaboradoresService.update(Number(id), updateData);

                // Atualizar perfis
                if (data.perfis && data.perfis.length > 0) {
                    await colaboradoresService.updatePerfis(
                        Number(id),
                        escritorioId,
                        data.perfis
                    );
                }

                toast.success('Colaborador atualizado com sucesso!');
            } else {
                // Criar novo colaborador
                const createData: any = {
                    nome: data.nome,
                    email: data.email,
                    cpf: data.cpf ? unmask(data.cpf) : undefined,
                    telefone: data.telefone ? unmask(data.telefone) : undefined,
                    data_nascimento: data.dataNascimento,
                    tipo: 'Geral', // Mantido para compatibilidade com backend
                    senha: data.senha || '',
                    tipo_pix: data.tipoPix,
                    chave_pix: data.chavePix,
                    perfis: data.perfis,
                };

                const novoColaborador = await colaboradoresService.create(createData);

                // Atualizar perfis
                if (data.perfis && data.perfis.length > 0 && escritorioId) {
                    await colaboradoresService.updatePerfis(
                        novoColaborador.id,
                        escritorioId,
                        data.perfis
                    );
                }

                toast.success('Colaborador cadastrado com sucesso!');
            }

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
                <PageHeader title={isEdit ? 'Editar Colaborador' : 'Novo Colaborador'} showBack />
                <SkeletonCard lines={10} />
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
                                        defaultValue={colaborador?.tipo_pix}
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
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>
                                        Perfis <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {PERFIS_DISPONIVEIS.map((perfil) => (
                                            <div
                                                key={perfil}
                                                className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50"
                                            >
                                                <Checkbox
                                                    id={`perfil-${perfil}`}
                                                    checked={perfisSelecionados.includes(perfil)}
                                                    onCheckedChange={() => handlePerfilToggle(perfil)}
                                                    className="border-2 border-gray-300 data-[state=unchecked]:bg-gray-50 data-[state=unchecked]:hover:bg-gray-100 data-[state=unchecked]:hover:border-gray-400"
                                                />
                                                <Label
                                                    htmlFor={`perfil-${perfil}`}
                                                    className="flex-1 cursor-pointer font-normal"
                                                >
                                                    {perfil}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.perfis && (
                                        <p className="text-sm text-destructive">
                                            {errors.perfis.message}
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
                                            {...register('senha', {
                                                required: !isEdit ? 'Senha é obrigatória' : false,
                                            })}
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
