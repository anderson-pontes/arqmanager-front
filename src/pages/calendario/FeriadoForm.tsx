import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { mockFeriados } from '@/data';
import { Save, X } from 'lucide-react';

export function FeriadoForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const feriado = isEdit ? mockFeriados.find((f) => f.id === Number(id)) : null;

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: feriado || {
            recorrente: true,
            tipo: 'Nacional',
            cor: '#DC3545',
        },
    });

    const recorrente = watch('recorrente');

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(isEdit ? 'Feriado atualizado!' : 'Feriado cadastrado!');
        navigate('/agenda/feriados');
    };

    return (
        <div>
            <PageHeader
                title={isEdit ? 'Editar Feriado' : 'Novo Feriado'}
                description="Cadastre ou edite um feriado"
                showBack
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Dados do Feriado</CardTitle>
                        <CardDescription>Informações do feriado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome do Feriado *</Label>
                                <Input id="nome" {...register('nome')} required placeholder="Ex: Natal" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="data">Data *</Label>
                                <Input id="data" type="date" {...register('data')} required />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo *</Label>
                                <Select
                                    onValueChange={(value) => setValue('tipo', value)}
                                    defaultValue={feriado?.tipo || 'Nacional'}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nacional">Nacional</SelectItem>
                                        <SelectItem value="Estadual">Estadual</SelectItem>
                                        <SelectItem value="Municipal">Municipal</SelectItem>
                                        <SelectItem value="Ponto Facultativo">Ponto Facultativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cor">Cor</Label>
                                <Input id="cor" type="color" {...register('cor')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                {...register('descricao')}
                                placeholder="Descrição opcional do feriado"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="recorrente">Feriado Recorrente</Label>
                                <p className="text-sm text-muted-foreground">
                                    {recorrente
                                        ? 'Este feriado se repete todos os anos'
                                        : 'Feriado único (não se repete)'}
                                </p>
                            </div>
                            <Switch
                                id="recorrente"
                                checked={recorrente}
                                onCheckedChange={(checked) => setValue('recorrente', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate('/agenda/feriados')}>
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
