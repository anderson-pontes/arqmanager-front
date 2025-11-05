import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { Plus, Users, MapPin, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { mockReunioes } from '@/data';
import type { Reuniao } from '@/types';

interface ProjetoReunioesProps {
    projetoId: number;
}

export function ProjetoReunioes({ projetoId }: ProjetoReunioesProps) {
    const [selectedReuniao, setSelectedReuniao] = useState<Reuniao | null>(null);
    const [novaManifestacao, setNovaManifestacao] = useState('');

    const reunioes = useMemo(
        () =>
            mockReunioes
                .filter((r) => r.projeto.id === projetoId)
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
        [projetoId]
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Confirmada':
                return <Badge className="bg-green-500">Confirmada</Badge>;
            case 'Pendente':
                return <Badge className="bg-yellow-500">Pendente</Badge>;
            case 'Cancelada':
                return <Badge className="bg-red-500">Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleAddManifestacao = () => {
        if (!novaManifestacao.trim()) return;
        // Aqui você adicionaria a lógica para salvar a manifestação
        console.log('Nova manifestação:', novaManifestacao);
        setNovaManifestacao('');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Reuniões e Atas
                        </CardTitle>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Reunião
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {reunioes.map((reuniao) => (
                            <div
                                key={reuniao.id}
                                className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                                onClick={() => setSelectedReuniao(reuniao)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(reuniao.status)}
                                            {reuniao.deAcordo ? (
                                                <Badge variant="outline" className="text-green-600">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Cliente de Acordo
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-red-600">
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                    Aguardando Confirmação
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(reuniao.data)}
                                            </div>
                                            {reuniao.local && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {reuniao.local}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {reuniao.participantes.length} participantes
                                            </div>
                                            {reuniao.manifestacoes.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    {reuniao.manifestacoes.length} manifestações
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm">{reuniao.observacao}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {reunioes.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-muted-foreground">
                                    Nenhuma reunião agendada
                                </p>
                                <Button className="mt-4" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agendar Primeira Reunião
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Dialog de Detalhes da Reunião */}
            <Dialog open={!!selectedReuniao} onOpenChange={() => setSelectedReuniao(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Reunião</DialogTitle>
                    </DialogHeader>

                    {selectedReuniao && (
                        <div className="space-y-6">
                            {/* Informações da Reunião */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedReuniao.status)}
                                    {selectedReuniao.deAcordo ? (
                                        <Badge variant="outline" className="text-green-600">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Cliente de Acordo
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-600">
                                            <XCircle className="mr-1 h-3 w-3" />
                                            Aguardando Confirmação
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Data e Hora
                                        </label>
                                        <p className="font-medium">
                                            {formatDateTime(selectedReuniao.data)}
                                        </p>
                                    </div>

                                    {selectedReuniao.local && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Local
                                            </label>
                                            <p className="font-medium">{selectedReuniao.local}</p>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Participantes
                                        </label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {selectedReuniao.participantes.map((p, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {p}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Observações
                                        </label>
                                        <p className="text-sm mt-1">{selectedReuniao.observacao}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ata da Reunião */}
                            {selectedReuniao.ata && (
                                <div>
                                    <h4 className="font-semibold mb-2">Ata da Reunião</h4>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm whitespace-pre-wrap">
                                            {selectedReuniao.ata}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Manifestações */}
                            <div>
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Manifestações ({selectedReuniao.manifestacoes.length})
                                </h4>

                                <div className="space-y-4">
                                    {selectedReuniao.manifestacoes.map((manifestacao) => (
                                        <div
                                            key={manifestacao.id}
                                            className="p-4 rounded-lg border bg-card"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-medium">
                                                        {manifestacao.autor}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDateTime(manifestacao.data)}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        manifestacao.tipo === 'Cliente'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {manifestacao.tipo}
                                                </Badge>
                                            </div>
                                            <p className="text-sm">{manifestacao.mensagem}</p>
                                        </div>
                                    ))}

                                    {/* Nova Manifestação */}
                                    <div className="space-y-2">
                                        <Textarea
                                            placeholder="Adicionar nova manifestação..."
                                            value={novaManifestacao}
                                            onChange={(e) => setNovaManifestacao(e.target.value)}
                                            rows={3}
                                        />
                                        <div className="flex justify-end">
                                            <Button onClick={handleAddManifestacao} size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Adicionar Manifestação
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
