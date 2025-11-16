import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { servicoService, etapaService } from '@/api/services/servico.service';
import type { Servico, Etapa } from '@/types';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function EtapasPage() {
    const navigate = useNavigate();
    const [etapas, setEtapas] = useState<Etapa[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [servicoFiltro, setServicoFiltro] = useState<number | 'all'>('all');
    const [confirmDelete, setConfirmDelete] = useState<{ etapa: Etapa; servico: Servico } | null>(null);

    useEffect(() => {
        loadServicos();
    }, []);

    useEffect(() => {
        if (servicos.length > 0) {
            loadEtapas();
        }
    }, [servicos, servicoFiltro]);

    const loadServicos = async () => {
        try {
            setLoading(true);
            const data = await servicoService.list({ ativo: true });
            setServicos(data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            toast.error('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    const loadEtapas = async () => {
        try {
            setLoading(true);
            const todasEtapas: Etapa[] = [];
            
            for (const servico of servicos) {
                try {
                    const etapasServico = await etapaService.listByServico(servico.id);
                    todasEtapas.push(...etapasServico);
                } catch (error) {
                    console.error(`Erro ao carregar etapas do serviço ${servico.id}:`, error);
                }
            }
            
            setEtapas(todasEtapas);
        } catch (error) {
            console.error('Erro ao carregar etapas:', error);
            toast.error('Erro ao carregar etapas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            await etapaService.delete(confirmDelete.servico.id, confirmDelete.etapa.id);
            toast.success('Etapa excluída com sucesso');
            setConfirmDelete(null);
            loadEtapas();
        } catch (error) {
            console.error('Erro ao excluir etapa:', error);
            toast.error('Erro ao excluir etapa');
        }
    };

    const etapasFiltradas = etapas.filter((etapa) => {
        const matchSearch = searchTerm === '' || 
            etapa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etapa.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchServico = servicoFiltro === 'all' || etapa.servico_id === servicoFiltro;
        
        return matchSearch && matchServico;
    });

    const getServicoNome = (servicoId: number) => {
        return servicos.find(s => s.id === servicoId)?.nome || 'N/A';
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Etapas"
                description="Gerencie as etapas dos serviços"
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/servicos')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            onClick={() => navigate('/servicos/etapas/novo')}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Etapa
                        </Button>
                    </div>
                }
            />

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar etapas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Select
                            value={servicoFiltro === 'all' ? 'all' : String(servicoFiltro)}
                            onValueChange={(value) => 
                                setServicoFiltro(value === 'all' ? 'all' : Number(value))
                            }
                        >
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Filtrar por serviço" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os serviços</SelectItem>
                                {servicos.map((servico) => (
                                    <SelectItem key={servico.id} value={String(servico.id)}>
                                        {servico.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Etapas */}
            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : etapasFiltradas.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhuma etapa encontrada
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Serviço</TableHead>
                                    <TableHead>Ordem</TableHead>
                                    <TableHead>Exibir para Cliente</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {etapasFiltradas.map((etapa) => (
                                    <TableRow key={etapa.id}>
                                        <TableCell className="font-medium">
                                            {etapa.nome}
                                        </TableCell>
                                        <TableCell>
                                            {getServicoNome(etapa.servico_id)}
                                        </TableCell>
                                        <TableCell>{etapa.ordem}</TableCell>
                                        <TableCell>
                                            <Badge variant={etapa.obrigatoria ? 'default' : 'secondary'}>
                                                {etapa.obrigatoria ? 'Sim' : 'Não'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const servico = servicos.find(s => s.id === etapa.servico_id);
                                                        if (servico) {
                                                            navigate(`/servicos/etapas/${etapa.id}/editar`, {
                                                                state: { etapa, servico }
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const servico = servicos.find(s => s.id === etapa.servico_id);
                                                        if (servico) {
                                                            setConfirmDelete({ etapa, servico });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de Confirmação */}
            <ConfirmDialog
                open={!!confirmDelete}
                onOpenChange={(open) => !open && setConfirmDelete(null)}
                title="Excluir Etapa"
                description={`Tem certeza que deseja excluir a etapa "${confirmDelete?.etapa.nome}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleDelete}
            />
        </div>
    );
}

