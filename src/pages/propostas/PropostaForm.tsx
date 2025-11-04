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
import { mockPropostas, mockClientes, mockServicos, mockStatus } from '@/data';
import { Save, X } from 'lucide-react';

export function PropostaForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const proposta = isEdit ? mockPropostas.find((p) => p.id === Number(id)) : null;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: proposta
            ? {
                numero: proposta.numero,
                ano: proposta.ano,
                identificacao: proposta.identificacao,
                descricao: proposta.descricao,
                clienteId: proposta.cliente.id,
                servicoId: proposta.servico.id,
                status: proposta.status,
                valorProposta: proposta.valorProposta,
                valorParcelaAprazo: proposta.valorParcelaAprazo,
                dataProposta: proposta.dataProposta,
                observacao: proposta.observacao,
            }
            : {
                status: 'Aguardando',
                ano: new Date().getFullYear(),
            },
    });

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Dados da proposta:', data);
        toast.success(isEdit ? 'Proposta atualizada!' : 'Proposta cadastrada!');
        navigate('/propostas');
    };

    const statusProposta = mockStatus.filter((s) => s.tipo === 'proposta');

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Proposta' : 'Nova Proposta'}
                description="Cadastre ou edite uma proposta"
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    {/* Dados Básicos */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Dados Básicos</CardTitle>
                            <CardDescription>Informações principais da proposta</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="numero">Número *</Label>
                                    <Input id="numero" {...register('numero')} required placeholder="001" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ano">Ano *</Label>
                                    <Input
                                        id="ano"
                                        type="number"
                                        {...register('ano')}
                                        required
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dataProposta">Data *</Label>
                                    <Input id="dataProposta" type="date" {...register('dataProposta')} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="identificacao">Identificação *</Label>
                                <Input
                                    id="identificacao"
                                    {...register('identificacao')}
                                    required
                                    placeholder="Ex: Projeto Residencial - Bairro X"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="clienteId">Cliente *</Label>
                                    <Select
                                        onValueChange={(value) => setValue('clienteId', Number(value))}
                                        defaultValue={proposta?.cliente.id.toString()}
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
                                <div className="space-y-2">
                                    <Label htmlFor="servicoId">Serviço *</Label>
                                    <Select
                                        onValueChange={(value) => setValue('servicoId', Number(value))}
                                        defaultValue={proposta?.servico.id.toString()}
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descricao">Descrição *</Label>
                                <Textarea
                                    id="descricao"
                                    {...register('descricao')}
                                    required
                                    placeholder="Descrição da proposta"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Valores */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Valores</CardTitle>
                            <CardDescription>Informações financeiras da proposta</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="valorProposta">Valor da Proposta *</Label>
                                    <Input
                                        id="valorProposta"
                                        type="number"
                                        step="0.01"
                                        {...register('valorProposta')}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="valorParcelaAprazo">Valor da Parcela</Label>
                                    <Input
                                        id="valorParcelaAprazo"
                                        type="number"
                                        step="0.01"
                                        {...register('valorParcelaAprazo')}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status e Observações */}
                    <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Status e Observações</CardTitle>
                            <CardDescription>Status atual e informações adicionais</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    onValueChange={(value) => setValue('status', value)}
                                    defaultValue={proposta?.status || 'Aguardando'}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusProposta.map((status) => (
                                            <SelectItem key={status.id} value={status.nome}>
                                                {status.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observacao">Observações</Label>
                                <Textarea
                                    id="observacao"
                                    {...register('observacao')}
                                    placeholder="Observações sobre a proposta"
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/propostas')}>
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
