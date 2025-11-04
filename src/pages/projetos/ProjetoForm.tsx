import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mockProjetos, mockClientes, mockServicos, mockColaboradores, mockStatus } from '@/data';
import { Save, X } from 'lucide-react';

export function ProjetoForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const projeto = isEdit ? mockProjetos.find((p) => p.id === Number(id)) : null;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: projeto
            ? {
                numero: projeto.numero,
                descricao: projeto.descricao,
                clienteId: projeto.cliente.id,
                servicoId: projeto.servico.id,
                status: projeto.status,
                valorContrato: projeto.valorContrato,
                metragem: projeto.metragem,
                dataInicio: projeto.dataInicio,
                dataPrevisaoFim: projeto.dataPrevisaoFim,
                observacao: projeto.observacao,
            }
            : {
                status: 'Em Andamento',
            },
    });

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Dados do projeto:', data);
        toast.success(isEdit ? 'Projeto atualizado!' : 'Projeto cadastrado!');
        navigate('/projetos');
    };

    const statusProjeto = mockStatus.filter((s) => s.tipo === 'projeto');

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Projeto' : 'Novo Projeto'}
                description="Cadastre ou edite um projeto"
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    {/* Dados Básicos */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Dados Básicos</CardTitle>
                            <CardDescription>Informações principais do projeto</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="numero">Número do Projeto *</Label>
                                    <Input id="numero" {...register('numero')} required placeholder="2024/001" />
                                    {errors.numero && (
                                        <p className="text-sm text-destructive">{errors.numero.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clienteId">Cliente *</Label>
                                    <Select
                                        onValueChange={(value) => setValue('clienteId', Number(value))}
                                        defaultValue={projeto?.cliente.id.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockClientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                                    {cliente.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="servicoId">Serviço *</Label>
                                    <Select
                                        onValueChange={(value) => setValue('servicoId', Number(value))}
                                        defaultValue={projeto?.servico.id.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o serviço" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockServicos.map((servico) => (
                                                <SelectItem key={servico.id} value={servico.id.toString()}>
                                                    {servico.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        onValueChange={(value) => setValue('status', value)}
                                        defaultValue={projeto?.status || 'Em Andamento'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusProjeto.map((status) => (
                                                <SelectItem key={status.id} value={status.nome}>
                                                    {status.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descricao">Descrição *</Label>
                                <Textarea
                                    id="descricao"
                                    {...register('descricao')}
                                    required
                                    placeholder="Descrição do projeto"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Valores e Prazos */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Valores e Prazos</CardTitle>
                            <CardDescription>Informações financeiras e cronograma</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="valorContrato">Valor do Contrato *</Label>
                                    <Input
                                        id="valorContrato"
                                        type="number"
                                        step="0.01"
                                        {...register('valorContrato')}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metragem">Metragem (m²)</Label>
                                    <Input
                                        id="metragem"
                                        type="number"
                                        step="0.01"
                                        {...register('metragem')}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dataInicio">Data de Início *</Label>
                                    <Input id="dataInicio" type="date" {...register('dataInicio')} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dataPrevisaoFim">Previsão de Término *</Label>
                                    <Input id="dataPrevisaoFim" type="date" {...register('dataPrevisaoFim')} required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Observações */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Observações</CardTitle>
                            <CardDescription>Informações adicionais</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="observacao">Observações</Label>
                                <Textarea
                                    id="observacao"
                                    {...register('observacao')}
                                    placeholder="Observações sobre o projeto"
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/projetos')}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
