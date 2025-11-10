import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CreateEscritorioRequest, CreateAdminRequest } from '@/api/services/admin.service';
import { Building2, User, Loader2 } from 'lucide-react';
import { maskCNPJ, maskCPF, maskCEP, maskPhone, unmask } from '@/utils/masks';
import { cepService } from '@/services/cep.service';
import { toast } from 'sonner';

interface CreateEscritorioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (escritorioData: CreateEscritorioRequest, adminData: CreateAdminRequest) => Promise<void>;
}

export function CreateEscritorioDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreateEscritorioDialogProps) {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('escritorio');

    // Dados do escritório
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

    // Dados do admin
    const [adminNome, setAdminNome] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminSenha, setAdminSenha] = useState('');
    const [adminCpf, setAdminCpf] = useState('');
    const [adminTelefone, setAdminTelefone] = useState('');

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

    const handleSubmit = async () => {
        if (activeTab === 'escritorio') {
            // Validar dados do escritório (CNPJ e CPF são opcionais)
            if (!nomeFantasia || !razaoSocial || !email) {
                return;
            }
            setActiveTab('admin');
            return;
        }

        // Validar dados do admin
        if (!adminNome || !adminEmail || !adminSenha) {
            return;
        }

        try {
            setLoading(true);
            const escritorioData: CreateEscritorioRequest = {
                nome_fantasia: nomeFantasia,
                razao_social: razaoSocial,
                documento: documento && documento.trim() ? unmask(documento.trim()) : null,
                cpf: cpf && cpf.trim() ? unmask(cpf.trim()) : null,
                email: email,
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
                cor: cor,
            };

            const adminData: CreateAdminRequest = {
                nome: adminNome,
                email: adminEmail,
                senha: adminSenha,
                cpf: adminCpf && adminCpf.trim() ? unmask(adminCpf.trim()) : undefined,
                telefone: adminTelefone && adminTelefone.trim() ? unmask(adminTelefone.trim()) : undefined,
            };

            await onSubmit(escritorioData, adminData);

            // Reset form
            setNomeFantasia('');
            setRazaoSocial('');
            setDocumento('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setCep('');
            setLogradouro('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setUf('');
            setEndereco('');
            setCor('#6366f1');
            setAdminNome('');
            setAdminEmail('');
            setAdminSenha('');
            setAdminCpf('');
            setAdminTelefone('');
            setActiveTab('escritorio');
        } catch (error) {
            // Erro já tratado no componente pai
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onOpenChange(false);
            // Reset form
            setNomeFantasia('');
            setRazaoSocial('');
            setDocumento('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setCep('');
            setLogradouro('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setUf('');
            setEndereco('');
            setCor('#6366f1');
            setAdminNome('');
            setAdminEmail('');
            setAdminSenha('');
            setAdminCpf('');
            setAdminTelefone('');
            setActiveTab('escritorio');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Criar Novo Escritório</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do escritório e do administrador que será criado automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="escritorio" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Dados do Escritório
                        </TabsTrigger>
                        <TabsTrigger value="admin" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Administrador
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="escritorio" className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                                <Input
                                    id="nomeFantasia"
                                    value={nomeFantasia}
                                    onChange={(e) => setNomeFantasia(e.target.value)}
                                    placeholder="Ex: ARQManager"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="razaoSocial">Razão Social *</Label>
                                <Input
                                    id="razaoSocial"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                    placeholder="Ex: ARQManager Ltda"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="documento">CNPJ</Label>
                                    <Input
                                        id="documento"
                                        value={documento}
                                        onChange={(e) => setDocumento(maskCNPJ(e.target.value))}
                                        placeholder="00.000.000/0000-00"
                                        maxLength={18}
                                    />
                                </div>
                                <div className="grid gap-2">
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

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="contato@escritorio.com"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    value={telefone}
                                    onChange={(e) => setTelefone(maskPhone(e.target.value))}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>

                            {/* Seção de Endereço */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-sm font-semibold">Endereço</h3>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2 col-span-2">
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

                                <div className="grid gap-2">
                                    <Label htmlFor="logradouro">Logradouro</Label>
                                    <Input
                                        id="logradouro"
                                        value={logradouro}
                                        onChange={(e) => setLogradouro(e.target.value)}
                                        placeholder="Rua, Avenida, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="numero">Número</Label>
                                        <Input
                                            id="numero"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                            placeholder="123"
                                        />
                                    </div>
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="complemento">Complemento</Label>
                                        <Input
                                            id="complemento"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value)}
                                            placeholder="Apto, Sala, etc."
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bairro">Bairro</Label>
                                    <Input
                                        id="bairro"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        placeholder="Bairro"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="cidade">Cidade</Label>
                                        <Input
                                            id="cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                            placeholder="Cidade"
                                        />
                                    </div>
                                    <div className="grid gap-2">
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
                            </div>

                            <div className="grid gap-2">
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
                        </div>
                    </TabsContent>

                    <TabsContent value="admin" className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="adminNome">Nome Completo *</Label>
                                <Input
                                    id="adminNome"
                                    value={adminNome}
                                    onChange={(e) => setAdminNome(e.target.value)}
                                    placeholder="Nome do administrador"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="adminEmail">Email *</Label>
                                <Input
                                    id="adminEmail"
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@escritorio.com"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="adminSenha">Senha *</Label>
                                <Input
                                    id="adminSenha"
                                    type="password"
                                    value={adminSenha}
                                    onChange={(e) => setAdminSenha(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="adminCpf">CPF</Label>
                                <Input
                                    id="adminCpf"
                                    value={adminCpf}
                                    onChange={(e) => setAdminCpf(maskCPF(e.target.value))}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="adminTelefone">Telefone</Label>
                                <Input
                                    id="adminTelefone"
                                    value={adminTelefone}
                                    onChange={(e) => setAdminTelefone(maskPhone(e.target.value))}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? 'Criando...'
                            : activeTab === 'escritorio'
                            ? 'Próximo'
                            : 'Criar Escritório'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

