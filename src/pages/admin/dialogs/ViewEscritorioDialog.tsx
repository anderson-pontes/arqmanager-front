import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Escritorio } from '@/types';
import { Building2, Mail, Phone, MapPin, FileText, Calendar, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ViewEscritorioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    escritorio: Escritorio | null;
}

export function ViewEscritorioDialog({
    open,
    onOpenChange,
    escritorio,
}: ViewEscritorioDialogProps) {
    if (!escritorio) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: escritorio.cor }}
                        />
                        <div>
                            <DialogTitle className="text-2xl">{escritorio.nomeFantasia}</DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                {escritorio.razaoSocial}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                        <Badge variant={escritorio.ativo ? 'default' : 'secondary'}>
                            {escritorio.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {escritorio.created_at && (
                            <span className="text-sm text-muted-foreground">
                                Criado em {format(new Date(escritorio.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        )}
                    </div>

                    <Separator />

                    {/* Informações Básicas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Informações Básicas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                                <p className="text-base">{escritorio.documento}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </p>
                                <p className="text-base">{escritorio.email}</p>
                            </div>
                            {escritorio.telefone && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Telefone
                                    </p>
                                    <p className="text-base">{escritorio.telefone}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    Cor
                                </p>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded border border-border"
                                        style={{ backgroundColor: escritorio.cor }}
                                    />
                                    <p className="text-base">{escritorio.cor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {escritorio.endereco && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Endereço
                                </h3>
                                <p className="text-base">{escritorio.endereco}</p>
                            </div>
                        </>
                    )}

                    {escritorio.created_at && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Datas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                                        <p className="text-base">
                                            {format(new Date(escritorio.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    {escritorio.updated_at && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                                            <p className="text-base">
                                                {format(new Date(escritorio.updated_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

