import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService } from '@/api/services/admin.service';
import type { Escritorio } from '@/types';
import type { CreateEscritorioRequest } from '@/api/services/admin.service';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { maskCNPJ, maskCPF, maskCEP, maskPhone, unmask } from '@/utils/masks';
import { formatCNPJ, formatCPF, formatCEP, formatPhone } from '@/utils/formatters';
import { cepService } from '@/services/cep.service';

export function EditEscritorioPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Estados do formulário
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [documento, setDocumento] = useState('');  // CNPJ
    const [cpf, setCpf] = useState('');  // CPF
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    // Campos de endereço separados
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [endereco, setEndereco] = useState('');  // Mantido para compatibilidade
    const [cor, setCor] = useState('#6366f1');
    const [loadingCEP, setLoadingCEP] = useState(false);

    useEffect(() => {
        const loadEscritorio = async () => {
            if (!id) {
                toast.error('ID do escritório não fornecido');
                navigate('/admin');
                return;
            }

            try {
                setLoading(true);
                const data = await adminService.getEscritorio(parseInt(id));
                
                // Preencher formulário
                setNomeFantasia(data.nomeFantasia || '');
                setRazaoSocial(data.razaoSocial || '');
                // Formatar CNPJ e CPF ao carregar
                const documentoValue = data.documento;
                if (documentoValue && documentoValue !== '-') {
                    setDocumento(formatCNPJ(documentoValue) !== '-' ? formatCNPJ(documentoValue) : '');
                } else {
                    setDocumento('');
                }
                const cpfValue = data.cpf;
                if (cpfValue && cpfValue !== '-') {
                    setCpf(formatCPF(cpfValue) !== '-' ? formatCPF(cpfValue) : '');
                } else {
                    setCpf('');
                }
                setEmail(data.email || '');
                // Formatar telefone ao carregar
                const telefoneValue = data.telefone || '';
                setTelefone(telefoneValue ? formatPhone(telefoneValue) : '');
                // Campos de endereço separados
                const cepValue = data.cep || '';
                setCep(cepValue ? formatCEP(cepValue) : '');
                setLogradouro(data.logradouro ?? '');
                setNumero(data.numero ?? '');
                setComplemento(data.complemento ?? '');
                setBairro(data.bairro ?? '');
                setCidade(data.cidade ?? '');
                setUf(data.uf ?? '');
                setEndereco(data.endereco ?? '');
                setCor(data.cor || '#6366f1');
            } catch (error: any) {
                toast.error('Erro ao carregar escritório', {
                    description: error.response?.data?.detail || error.message,
                });
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        loadEscritorio();
    }, [id, navigate]);

    const handleBuscarCEP = async () => {
        if (!cep || cep.replace(/\D/g, '').length !== 8) {
            toast.error('CEP inválido');
            return;
        }

        try {
            setLoadingCEP(true);
            const cepData = await cepService.buscarCEP(cep);
            
            if (cepData) {
                setLogradouro(cepData.logradouro || '');
                setBairro(cepData.bairro || '');
                setCidade(cepData.localidade || '');
                setUf(cepData.uf || '');
                setComplemento(cepData.complemento || '');
                toast.success('CEP encontrado!');
            } else {
                toast.error('CEP não encontrado');
            }
        } catch (error) {
            toast.error('Erro ao buscar CEP');
        } finally {
            setLoadingCEP(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id || !nomeFantasia || !razaoSocial || !email) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setSaving(true);
            const data: Partial<CreateEscritorioRequest> = {
                nome_fantasia: nomeFantasia,
                razao_social: razaoSocial,
                documento: documento && documento.trim() ? unmask(documento.trim()) : null,
                cpf: cpf && cpf.trim() ? unmask(cpf.trim()) : null,
                email,
                telefone: telefone && telefone.trim() ? unmask(telefone.trim()) : undefined,
                // Campos de endereço separados
                logradouro: logradouro || undefined,
                numero: numero || undefined,
                complemento: complemento || undefined,
                bairro: bairro || undefined,
                cidade: cidade || undefined,
                uf: uf || undefined,
                cep: cep && cep.trim() ? unmask(cep.trim()) : undefined,
                // Endereço completo (mantido para compatibilidade)
                endereco: endereco || undefined,
                cor,
            };

            await adminService.updateEscritorio(parseInt(id), data);
            toast.success('Escritório atualizado com sucesso!');
            navigate(`/admin/escritorios/${id}`);
        } catch (error: any) {
            toast.error('Erro ao atualizar escritório', {
                description: error.response?.data?.detail || error.message,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate(`/admin/escritorios/${id}`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
                <h1 className="text-3xl font-bold">Editar Escritório</h1>
                <div className="w-24" /> {/* Spacer para centralizar título */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                        <CardDescription>Dados principais do escritório</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                                <Input
                                    id="nomeFantasia"
                                    value={nomeFantasia}
                                    onChange={(e) => setNomeFantasia(e.target.value)}
                                    placeholder="Ex: Arquitetura & Design"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="razaoSocial">Razão Social *</Label>
                                <Input
                                    id="razaoSocial"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                    placeholder="Ex: Arquitetura Design LTDA"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="documento">CNPJ</Label>
                                <Input
                                    id="documento"
                                    value={documento}
                                    onChange={(e) => setDocumento(maskCNPJ(e.target.value))}
                                    placeholder="00.000.000/0000-00"
                                    maxLength={18}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    value={cpf}
                                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="contato@escritorio.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(maskPhone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                maxLength={15}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cor">Cor do Escritório</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cor"
                                    type="color"
                                    value={cor}
                                    onChange={(e) => setCor(e.target.value)}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={cor}
                                    onChange={(e) => setCor(e.target.value)}
                                    placeholder="#6366f1"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Endereço</CardTitle>
                        <CardDescription>Informações de localização do escritório</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="cep">CEP</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cep"
                                        value={cep}
                                        onChange={(e) => setCep(maskCEP(e.target.value))}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        onBlur={handleBuscarCEP}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBuscarCEP}
                                        disabled={loadingCEP || !cep || cep.replace(/\D/g, '').length !== 8}
                                    >
                                        {loadingCEP ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logradouro">Logradouro</Label>
                            <Input
                                id="logradouro"
                                value={logradouro}
                                onChange={(e) => setLogradouro(e.target.value)}
                                placeholder="Rua, Avenida, etc."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="numero">Número</Label>
                                <Input
                                    id="numero"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    placeholder="123"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="complemento">Complemento</Label>
                                <Input
                                    id="complemento"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    placeholder="Apto, Sala, etc."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bairro">Bairro</Label>
                            <Input
                                id="bairro"
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                placeholder="Bairro"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="cidade">Cidade</Label>
                                <Input
                                    id="cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    placeholder="Cidade"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="uf">UF</Label>
                                <Input
                                    id="uf"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                                    placeholder="SP"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/admin/escritorios/${id}`)}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

