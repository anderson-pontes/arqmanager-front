import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Building2,
    Save,
    Upload,
    Mail,
    Phone,
    MapPin,
    FileText,
    Settings,
    Palette,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockEscritorio } from '@/data';

export function EscritorioPage() {
    const [escritorio] = useState(mockEscritorio);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: escritorio,
    });

    const diasUteis = watch('diasUteis');

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Dados do escritório:', data);
        toast.success('Configurações atualizadas com sucesso!');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Logo carregada com sucesso!');
        }
    };

    return (
        <div>
            <PageHeader
                title="Escritório"
                description="Gerencie as configurações e dados do escritório"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Tabs defaultValue="dados" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="dados">
                            <Building2 className="mr-2 h-4 w-4" />
                            Dados Gerais
                        </TabsTrigger>
                        <TabsTrigger value="contato">
                            <Phone className="mr-2 h-4 w-4" />
                            Contato
                        </TabsTrigger>
                        <TabsTrigger value="preferencias">
                            <Settings className="mr-2 h-4 w-4" />
                            Preferências
                        </TabsTrigger>
                        <TabsTrigger value="documentos">
                            <FileText className="mr-2 h-4 w-4" />
                            Documentos
                        </TabsTrigger>
                    </TabsList>

                    {/* Dados Gerais */}
                    <TabsContent value="dados">
                        <div className="grid gap-6">
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Informações da Empresa</CardTitle>
                                    <CardDescription>Dados principais do escritório</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Logo */}
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-24 w-24">
                                            {logoPreview ? (
                                                <AvatarImage src={logoPreview} />
                                            ) : (
                                                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                                    <Building2 className="h-12 w-12" />
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <Label htmlFor="logo" className="cursor-pointer">
                                                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                                                    <Upload className="h-4 w-4" />
                                                    Carregar Logo
                                                </div>
                                            </Label>
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoUpload}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                PNG, JPG ou SVG (máx. 2MB)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                                            <Input
                                                id="nomeFantasia"
                                                {...register('nomeFantasia')}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="razaoSocial">Razão Social *</Label>
                                            <Input
                                                id="razaoSocial"
                                                {...register('razaoSocial')}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="documento">CNPJ *</Label>
                                            <Input
                                                id="documento"
                                                {...register('documento')}
                                                placeholder="00.000.000/0000-00"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                                            <Input
                                                id="inscricaoEstadual"
                                                placeholder="000.000.000.000"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Contato */}
                    <TabsContent value="contato">
                        <div className="grid gap-6">
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Informações de Contato</CardTitle>
                                    <CardDescription>Dados de contato do escritório</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register('email')}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone">Telefone *</Label>
                                            <Input
                                                id="telefone"
                                                {...register('telefone')}
                                                placeholder="(00) 0000-0000"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="endereco">Endereço Completo *</Label>
                                        <Textarea
                                            id="endereco"
                                            {...register('endereco')}
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="site">Site</Label>
                                            <Input
                                                id="site"
                                                placeholder="www.exemplo.com.br"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="instagram">Instagram</Label>
                                            <Input
                                                id="instagram"
                                                placeholder="@escritorio"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin">LinkedIn</Label>
                                            <Input
                                                id="linkedin"
                                                placeholder="linkedin.com/company/..."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Preferências */}
                    <TabsContent value="preferencias">
                        <div className="grid gap-6">
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Preferências do Sistema</CardTitle>
                                    <CardDescription>Configure o comportamento do sistema</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="diasUteis">Considerar apenas dias úteis</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Prazos serão calculados considerando apenas dias úteis
                                            </p>
                                        </div>
                                        <Switch
                                            id="diasUteis"
                                            checked={diasUteis}
                                            onCheckedChange={(checked) => setValue('diasUteis', checked)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prazoArquivaProposta">
                                            Prazo para arquivar proposta (dias)
                                        </Label>
                                        <Input
                                            id="prazoArquivaProposta"
                                            type="number"
                                            {...register('prazoArquivaProposta')}
                                            min="1"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Propostas sem resposta serão arquivadas automaticamente após este período
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cor">Cor Principal do Sistema</Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                id="cor"
                                                type="color"
                                                {...register('cor')}
                                                className="w-20 h-10"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                Esta cor será usada em destaques e elementos principais
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Documentos */}
                    <TabsContent value="documentos">
                        <div className="grid gap-6">
                            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Textos Padrão</CardTitle>
                                    <CardDescription>
                                        Configure textos padrão para propostas e contratos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="observacaoPropostaPadrao">
                                            Observação Padrão - Proposta
                                        </Label>
                                        <Textarea
                                            id="observacaoPropostaPadrao"
                                            {...register('observacaoPropostaPadrao')}
                                            rows={5}
                                            placeholder="Digite o texto padrão que aparecerá nas propostas..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="observacaoContratoPadrao">
                                            Observação Padrão - Contrato
                                        </Label>
                                        <Textarea
                                            id="observacaoContratoPadrao"
                                            {...register('observacaoContratoPadrao')}
                                            rows={5}
                                            placeholder="Digite o texto padrão que aparecerá nos contratos..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Botão Salvar */}
                <div className="flex justify-end mt-6">
                    <Button type="submit" size="lg">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                    </Button>
                </div>
            </form>
        </div>
    );
}
