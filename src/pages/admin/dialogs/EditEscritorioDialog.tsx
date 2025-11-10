import { useState, useEffect } from 'react';
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
import type { Escritorio } from '@/types';
import type { CreateEscritorioRequest } from '@/api/services/admin.service';
import { maskCNPJ, maskCPF, maskCEP, maskPhone, unmask } from '@/utils/masks';
import { formatCNPJ, formatCPF, formatCEP, formatPhone } from '@/utils/formatters';
import { cepService } from '@/services/cep.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditEscritorioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    escritorio: Escritorio | null;
    onSubmit: (id: number, data: Partial<CreateEscritorioRequest>) => Promise<void>;
}

export function EditEscritorioDialog({
    open,
    onOpenChange,
    escritorio,
    onSubmit,
}: EditEscritorioDialogProps) {
    const [loading, setLoading] = useState(false);
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
        if (escritorio && open) {
            setNomeFantasia(escritorio.nomeFantasia || '');
            setRazaoSocial(escritorio.razaoSocial || '');
            // Formatar CNPJ e CPF ao carregar
            const documentoValue = escritorio.documento || '';
            setDocumento(documentoValue ? formatCNPJ(documentoValue) : '');
            const cpfValue = escritorio.cpf || '';
            setCpf(cpfValue ? formatCPF(cpfValue) : '');
            setEmail(escritorio.email || '');
            // Formatar telefone ao carregar
            const telefoneValue = escritorio.telefone || '';
            setTelefone(telefoneValue ? formatPhone(telefoneValue) : '');
            // Campos de endereço separados
            const cepValue = escritorio.cep || '';
            setCep(cepValue ? formatCEP(cepValue) : '');
            setLogradouro(escritorio.logradouro ?? '');
            setNumero(escritorio.numero ?? '');
            setComplemento(escritorio.complemento ?? '');
            setBairro(escritorio.bairro ?? '');
            setCidade(escritorio.cidade ?? '');
            setUf(escritorio.uf ?? '');
            setEndereco(escritorio.endereco ?? '');
            setCor(escritorio.cor || '#6366f1');
        } else if (!open) {
            // Reset quando fechar
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
        }
    }, [escritorio, open]);

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
        if (!escritorio || !nomeFantasia || !razaoSocial || !email) {
            return;
        }

        try {
            setLoading(true);
            await onSubmit(escritorio.id, {
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
            });
            onOpenChange(false);
        } catch (error) {
            // Erro já tratado no componente pai
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Escritório</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do escritório
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                            <Input
                                id="nomeFantasia"
                                value={nomeFantasia}
                                onChange={(e) => setNomeFantasia(e.target.value)}
                                placeholder="Ex: Arquitetura & Design"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="razaoSocial">Razão Social *</Label>
                            <Input
                                id="razaoSocial"
                                value={razaoSocial}
                                onChange={(e) => setRazaoSocial(e.target.value)}
                                placeholder="Ex: Arquitetura Design LTDA"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                        <Label htmlFor="cor">Cor</Label>
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

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

