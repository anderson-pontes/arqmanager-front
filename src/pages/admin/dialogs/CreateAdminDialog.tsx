import { useState } from 'react';
import { maskPhone, maskCPF, unmask } from '@/utils/masks';
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
import type { CreateAdminRequest } from '@/api/services/admin.service';

interface CreateAdminDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (adminData: CreateAdminRequest) => Promise<void>;
    title: string;
    description: string;
}

export function CreateAdminDialog({
    open,
    onOpenChange,
    onSubmit,
    title,
    description,
}: CreateAdminDialogProps) {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleSubmit = async () => {
        if (!nome || !email || !senha) {
            return;
        }

        try {
            setLoading(true);
            const adminData: CreateAdminRequest = {
                nome,
                email,
                senha,
                cpf: cpf && cpf.trim() ? unmask(cpf.trim()) : undefined,
                telefone: telefone && telefone.trim() ? unmask(telefone.trim()) : undefined,
            };

            await onSubmit(adminData);

            // Reset form
            setNome('');
            setEmail('');
            setSenha('');
            setCpf('');
            setTelefone('');
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
            setNome('');
            setEmail('');
            setSenha('');
            setCpf('');
            setTelefone('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome do administrador"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@escritorio.com"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="senha">Senha *</Label>
                        <Input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
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
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !nome || !email || !senha}>
                        {loading ? 'Criando...' : 'Criar Administrador'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

