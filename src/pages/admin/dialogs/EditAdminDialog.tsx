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
import type { User } from '@/types';
import type { CreateAdminRequest } from '@/api/services/admin.service';

interface EditAdminDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    admin: User | null;
    onSubmit: (userId: number, data: Partial<CreateAdminRequest> & { senha?: string }) => Promise<void>;
}

export function EditAdminDialog({
    open,
    onOpenChange,
    admin,
    onSubmit,
}: EditAdminDialogProps) {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');

    useEffect(() => {
        if (admin) {
            setNome(admin.nome || '');
            setEmail(admin.email || '');
            setSenha('');
            setCpf(admin.cpf || '');
            setTelefone(admin.telefone || '');
        }
    }, [admin, open]);

    const handleSubmit = async () => {
        if (!admin || !nome || !email) {
            return;
        }

        try {
            setLoading(true);
            const data: Partial<CreateAdminRequest> & { senha?: string } = {
                nome,
                email,
            };
            
            if (senha) {
                data.senha = senha;
            }
            
            if (cpf && cpf.trim()) {
                data.cpf = cpf.trim();
            } else {
                data.cpf = undefined;
            }
            
            if (telefone && telefone.trim()) {
                data.telefone = telefone.trim();
            } else {
                data.telefone = undefined;
            }

            await onSubmit(admin.id, data);
            onOpenChange(false);
        } catch (error) {
            // Erro já tratado no componente pai
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Administrador</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do administrador
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senha">Nova Senha</Label>
                        <Input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Deixe em branco para manter a senha atual"
                        />
                        <p className="text-xs text-muted-foreground">
                            Deixe em branco para manter a senha atual
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(00) 00000-0000"
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

