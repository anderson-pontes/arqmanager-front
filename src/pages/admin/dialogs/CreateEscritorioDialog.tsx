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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CreateEscritorioRequest, CreateAdminRequest } from '@/api/services/admin.service';
import { Building2, User } from 'lucide-react';

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
    const [documento, setDocumento] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cor, setCor] = useState('#6366f1');

    // Dados do admin
    const [adminNome, setAdminNome] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminSenha, setAdminSenha] = useState('');
    const [adminCpf, setAdminCpf] = useState('');
    const [adminTelefone, setAdminTelefone] = useState('');

    const handleSubmit = async () => {
        if (activeTab === 'escritorio') {
            // Validar dados do escritório
            if (!nomeFantasia || !razaoSocial || !documento || !email) {
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
                documento: documento,
                email: email,
                telefone: telefone || undefined,
                endereco: endereco || undefined,
                cor: cor,
            };

            const adminData: CreateAdminRequest = {
                nome: adminNome,
                email: adminEmail,
                senha: adminSenha,
                cpf: adminCpf || undefined,
                telefone: adminTelefone || undefined,
            };

            await onSubmit(escritorioData, adminData);

            // Reset form
            setNomeFantasia('');
            setRazaoSocial('');
            setDocumento('');
            setEmail('');
            setTelefone('');
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
            setEmail('');
            setTelefone('');
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

                            <div className="grid gap-2">
                                <Label htmlFor="documento">CNPJ *</Label>
                                <Input
                                    id="documento"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                    placeholder="00.000.000/0000-00"
                                />
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
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Textarea
                                    id="endereco"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                    placeholder="Rua, número, bairro, cidade - UF"
                                    rows={3}
                                />
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
                                    onChange={(e) => setAdminCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="adminTelefone">Telefone</Label>
                                <Input
                                    id="adminTelefone"
                                    value={adminTelefone}
                                    onChange={(e) => setAdminTelefone(e.target.value)}
                                    placeholder="(00) 00000-0000"
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

