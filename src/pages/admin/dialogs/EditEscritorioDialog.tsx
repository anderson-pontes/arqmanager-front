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
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cor, setCor] = useState('#6366f1');

    useEffect(() => {
        if (escritorio && open) {
            setNomeFantasia(escritorio.nomeFantasia || '');
            setRazaoSocial(escritorio.razaoSocial || '');
            setEmail(escritorio.email || '');
            setTelefone(escritorio.telefone ?? '');
            setEndereco(escritorio.endereco ?? '');
            setCor(escritorio.cor || '#6366f1');
        } else if (!open) {
            // Reset quando fechar
            setNomeFantasia('');
            setRazaoSocial('');
            setEmail('');
            setTelefone('');
            setEndereco('');
            setCor('#6366f1');
        }
    }, [escritorio, open]);

    const handleSubmit = async () => {
        if (!escritorio || !nomeFantasia || !razaoSocial || !email) {
            return;
        }

        try {
            setLoading(true);
            await onSubmit(escritorio.id, {
                nome_fantasia: nomeFantasia,
                razao_social: razaoSocial,
                email,
                telefone: telefone || undefined,
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(00) 00000-0000"
                            />
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

                    <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                            id="endereco"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            placeholder="Rua, número, bairro, cidade - UF"
                        />
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

