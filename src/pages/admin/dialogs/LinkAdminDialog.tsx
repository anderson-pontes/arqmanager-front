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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { adminService } from '@/api/services/admin.service';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';

interface LinkAdminDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    escritorioId: number;
    onSuccess: () => void;
}

export function LinkAdminDialog({
    open,
    onOpenChange,
    escritorioId,
    onSuccess,
}: LinkAdminDialogProps) {
    const [loading, setLoading] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
    const [availableAdmins, setAvailableAdmins] = useState<User[]>([]);

    useEffect(() => {
        if (open) {
            loadAvailableAdmins();
        } else {
            setSelectedAdminId(null);
        }
    }, [open]);

    const loadAvailableAdmins = async () => {
        try {
            setLoadingAdmins(true);
            const admins = await adminService.getAvailableEscritorioAdmins({ limit: 1000 });
            setAvailableAdmins(admins);
        } catch (error) {
            console.error('Erro ao carregar administradores disponíveis:', error);
        } finally {
            setLoadingAdmins(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedAdminId) return;

        try {
            setLoading(true);
            await adminService.linkEscritorioAdmin(escritorioId, selectedAdminId);
            onSuccess();
            onOpenChange(false);
            setSelectedAdminId(null);
        } catch (error: any) {
            console.error('Erro ao vincular administrador:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Vincular Administrador Existente</DialogTitle>
                    <DialogDescription>
                        Selecione um administrador de escritório já cadastrado para vincular a este escritório
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin">Administrador</Label>
                        {loadingAdmins ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Select
                                value={selectedAdminId?.toString() || ''}
                                onValueChange={(value) => setSelectedAdminId(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um administrador" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableAdmins.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Nenhum administrador disponível
                                        </div>
                                    ) : (
                                        availableAdmins.map((admin) => (
                                            <SelectItem key={admin.id} value={admin.id.toString()}>
                                                {admin.nome} ({admin.email})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !selectedAdminId || loadingAdmins}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Vinculando...
                            </>
                        ) : (
                            'Vincular'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}







