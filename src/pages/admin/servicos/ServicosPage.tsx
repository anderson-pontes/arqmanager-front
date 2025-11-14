import { useState, useEffect } from 'react';
import { Plus, Search, X, Filter, Download, Upload, ArrowUp, ArrowDown } from 'lucide-react';
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
import { HierarchicalAccordion } from '@/components/common/HierarchicalAccordion';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ServicoForm } from './ServicoForm';
import { EtapaForm } from './EtapaForm';
import { TarefaForm } from './TarefaForm';
import { servicoService, etapaService, tarefaService } from '@/api/services/servico.service';
import type {
    Servico,
    Etapa,
    Tarefa,
} from '@/types';
import type {
    ServicoCreate,
    ServicoUpdate,
    EtapaCreate,
    EtapaUpdate,
    TarefaCreate,
    TarefaUpdate,
    ServicoListParams,
} from '@/api/services/servico.service';
import { toast } from 'sonner';

export function ServicosPage() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de busca e filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState<'all' | 'ativo' | 'inativo'>('all');
    
    // Estados dos formulários
    const [servicoFormOpen, setServicoFormOpen] = useState(false);
    const [etapaFormOpen, setEtapaFormOpen] = useState(false);
    const [tarefaFormOpen, setTarefaFormOpen] = useState(false);
    
    // Estados dos itens sendo editados
    const [servicoEditando, setServicoEditando] = useState<Servico | null>(null);
    const [etapaEditando, setEtapaEditando] = useState<{ servico: Servico; etapa: Etapa } | null>(null);
    const [tarefaEditando, setTarefaEditando] = useState<{ servico: Servico; etapa: Etapa; tarefa: Tarefa } | null>(null);
    
    // Estados dos itens para adicionar
    const [servicoParaEtapa, setServicoParaEtapa] = useState<Servico | null>(null);
    const [etapaParaTarefa, setEtapaParaTarefa] = useState<{ servico: Servico; etapa: Etapa } | null>(null);
    
    // Estados de confirmação de exclusão
    const [confirmDelete, setConfirmDelete] = useState<{
        type: 'servico' | 'etapa' | 'tarefa';
        servico: Servico;
        etapa?: Etapa;
        tarefa?: Tarefa;
    } | null>(null);
    
    const [submitting, setSubmitting] = useState(false);
    
    // A busca e filtros agora são feitos no backend, então usamos servicos diretamente
    const servicosFiltrados = servicos;
    
    // Handlers de busca
    const handleSearch = () => {
        setActiveSearch(searchTerm);
    };
    
    const handleClearSearch = () => {
        setSearchTerm('');
        setActiveSearch('');
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    // Exportar serviços
    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(servicosFiltrados, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `servicos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('Serviços exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar:', error);
            toast.error('Erro ao exportar serviços');
        }
    };
    
    // Importar serviços
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const data = JSON.parse(text) as Servico[];
                
                // Validar estrutura básica
                if (!Array.isArray(data)) {
                    throw new Error('Formato inválido: deve ser um array de serviços');
                }
                
                toast.info(`Importando ${data.length} serviços...`);
                
                // Aqui você pode implementar a lógica de importação
                // Por enquanto, apenas mostra os dados
                console.log('Dados para importar:', data);
                toast.success('Importação concluída! (Funcionalidade em desenvolvimento)');
            } catch (error) {
                console.error('Erro ao importar:', error);
                toast.error('Erro ao importar arquivo. Verifique o formato.');
            }
        };
        input.click();
    };

    // Carregar serviços
    const loadServicos = async () => {
        setLoading(true);
        try {
            console.log('🔄 Carregando serviços...');
            const params: ServicoListParams = {
                ativo: filtroAtivo === 'all' ? undefined : filtroAtivo === 'ativo',
                search: activeSearch || undefined,
            };
            const data = await servicoService.list(params);
            console.log('✅ Serviços carregados:', data);
            // Garantir que sempre seja um array
            const servicosArray = Array.isArray(data) ? data : [];
            setServicos(servicosArray);
            console.log(`📊 Total de serviços: ${servicosArray.length}`);
        } catch (error: any) {
            console.error('❌ Erro ao carregar serviços:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage = error.response?.data?.detail || error.message || 'Erro ao carregar serviços';
            toast.error(errorMessage);
            setServicos([]); // Garantir array vazio em caso de erro
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServicos();
    }, [activeSearch, filtroAtivo]);

    // Handlers de Serviço
    const handleCreateServico = async (data: ServicoCreate | ServicoUpdate) => {
        setSubmitting(true);
        try {
            if (servicoEditando) {
                await servicoService.update(servicoEditando.id, data as ServicoUpdate);
                toast.success('Serviço atualizado com sucesso!');
            } else {
                await servicoService.create(data as ServicoCreate);
                toast.success('Serviço criado com sucesso!');
            }
            setServicoFormOpen(false);
            setServicoEditando(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao salvar serviço');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteServico = async () => {
        if (!confirmDelete?.servico) return;
        
        setSubmitting(true);
        try {
            await servicoService.delete(confirmDelete.servico.id);
            toast.success('Serviço excluído com sucesso!');
            setConfirmDelete(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao excluir serviço');
        } finally {
            setSubmitting(false);
        }
    };

    // Handlers de Etapa
    const handleCreateEtapa = async (data: EtapaCreate | EtapaUpdate) => {
        if (!servicoParaEtapa && !etapaEditando) return;
        
        const servico = servicoParaEtapa || etapaEditando?.servico;
        if (!servico) return;

        setSubmitting(true);
        try {
            if (etapaEditando) {
                await etapaService.update(
                    servico.id,
                    etapaEditando.etapa.id,
                    data as EtapaUpdate
                );
                toast.success('Etapa atualizada com sucesso!');
            } else {
                await etapaService.create(servico.id, data as EtapaCreate);
                toast.success('Etapa criada com sucesso!');
            }
            setEtapaFormOpen(false);
            setEtapaEditando(null);
            setServicoParaEtapa(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao salvar etapa');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteEtapa = async () => {
        if (!confirmDelete?.servico || !confirmDelete?.etapa) return;
        
        setSubmitting(true);
        try {
            await etapaService.delete(
                confirmDelete.servico.id,
                confirmDelete.etapa.id
            );
            toast.success('Etapa excluída com sucesso!');
            setConfirmDelete(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao excluir etapa');
        } finally {
            setSubmitting(false);
        }
    };

    // Handlers de Tarefa
    const handleCreateTarefa = async (data: TarefaCreate | TarefaUpdate) => {
        if (!etapaParaTarefa && !tarefaEditando) return;
        
        const { servico, etapa } = etapaParaTarefa || {
            servico: tarefaEditando!.servico,
            etapa: tarefaEditando!.etapa,
        };

        setSubmitting(true);
        try {
            if (tarefaEditando) {
                await tarefaService.updateByEtapa(
                    servico.id,
                    etapa.id,
                    tarefaEditando.tarefa.id,
                    data as TarefaUpdate
                );
                toast.success('Tarefa atualizada com sucesso!');
            } else {
                await tarefaService.createByEtapa(
                    servico.id,
                    etapa.id,
                    data as TarefaCreate
                );
                toast.success('Tarefa criada com sucesso!');
            }
            setTarefaFormOpen(false);
            setTarefaEditando(null);
            setEtapaParaTarefa(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao salvar tarefa');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTarefa = async () => {
        if (!confirmDelete?.servico || !confirmDelete?.etapa || !confirmDelete?.tarefa) return;
        
        setSubmitting(true);
        try {
            await tarefaService.deleteByEtapa(
                confirmDelete.servico.id,
                confirmDelete.etapa.id,
                confirmDelete.tarefa.id
            );
            toast.success('Tarefa excluída com sucesso!');
            setConfirmDelete(null);
            await loadServicos();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao excluir tarefa');
        } finally {
            setSubmitting(false);
        }
    };

    // Handlers de reordenação
    const handleReorderServico = async (servicoId: number, direction: 'up' | 'down') => {
        const index = servicos.findIndex(s => s.id === servicoId);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= servicos.length) return;
        
        // Reordenar localmente (a ordem real seria salva no backend se houver campo de ordem)
        const newServicos = [...servicos];
        [newServicos[index], newServicos[newIndex]] = [newServicos[newIndex], newServicos[index]];
        setServicos(newServicos);
        
        toast.success('Ordem atualizada! (Salvar no backend em desenvolvimento)');
    };
    
    const handleReorderEtapa = async (servicoId: number, etapaId: number, direction: 'up' | 'down') => {
        const servico = servicos.find(s => s.id === servicoId);
        if (!servico || !servico.etapas) return;
        
        const etapas = servico.etapas;
        const index = etapas.findIndex(e => e.id === etapaId);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= etapas.length) return;
        
        // Reordenar e atualizar ordem
        const newEtapas = [...etapas];
        [newEtapas[index], newEtapas[newIndex]] = [newEtapas[newIndex], newEtapas[index]];
        
        // Atualizar ordens
        newEtapas.forEach((etapa, idx) => {
            etapa.ordem = idx;
        });
        
        // Atualizar no estado
        const updatedServicos = servicos.map(s => 
            s.id === servicoId 
                ? { ...s, etapas: newEtapas }
                : s
        );
        setServicos(updatedServicos);
        
        // Salvar no backend
        try {
            await etapaService.update(servicoId, newEtapas[index].id, { ordem: newEtapas[index].ordem });
            await etapaService.update(servicoId, newEtapas[newIndex].id, { ordem: newEtapas[newIndex].ordem });
            toast.success('Ordem das etapas atualizada!');
        } catch (error: any) {
            toast.error('Erro ao atualizar ordem das etapas');
            await loadServicos(); // Reverter em caso de erro
        }
    };
    
    const handleReorderTarefa = async (servicoId: number, etapaId: number, tarefaId: number, direction: 'up' | 'down') => {
        const servico = servicos.find(s => s.id === servicoId);
        if (!servico?.etapas) return;
        
        const etapa = servico.etapas.find(e => e.id === etapaId);
        if (!etapa || !etapa.tarefas) return;
        
        const tarefas = etapa.tarefas;
        const index = tarefas.findIndex(t => t.id === tarefaId);
        if (index === -1) return;
        
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= tarefas.length) return;
        
        // Reordenar
        const newTarefas = [...tarefas];
        [newTarefas[index], newTarefas[newIndex]] = [newTarefas[newIndex], newTarefas[index]];
        
        // Atualizar ordens
        newTarefas.forEach((tarefa, idx) => {
            tarefa.ordem = idx;
        });
        
        // Atualizar no estado
        const updatedServicos = servicos.map(s => 
            s.id === servicoId 
                ? {
                    ...s,
                    etapas: s.etapas?.map(e =>
                        e.id === etapaId ? { ...e, tarefas: newTarefas } : e
                    )
                }
                : s
        );
        setServicos(updatedServicos);
        
        // Salvar no backend
        try {
            await tarefaService.updateByEtapa(servicoId, etapaId, newTarefas[index].id, { ordem: newTarefas[index].ordem });
            await tarefaService.updateByEtapa(servicoId, etapaId, newTarefas[newIndex].id, { ordem: newTarefas[newIndex].ordem });
            toast.success('Ordem das tarefas atualizada!');
        } catch (error: any) {
            toast.error('Erro ao atualizar ordem das tarefas');
            await loadServicos(); // Reverter em caso de erro
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Serviços, Etapas e Tarefas"
                description="Gerencie os serviços oferecidos, suas etapas de entrega e tarefas"
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            title="Exportar serviços"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleImport}
                            title="Importar serviços"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Importar
                        </Button>
                        <Button onClick={() => {
                            setServicoEditando(null);
                            setServicoFormOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Serviço
                        </Button>
                    </div>
                }
            />

            {/* Barra de busca e filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Busca */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar por nome, código, descrição, etapa ou tarefa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-9"
                            />
                        </div>
                        
                        {/* Filtro de status */}
                        <Select value={filtroAtivo} onValueChange={(value: 'all' | 'ativo' | 'inativo') => setFiltroAtivo(value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="ativo">Apenas Ativos</SelectItem>
                                <SelectItem value="inativo">Apenas Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {/* Botões de ação */}
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                variant="default"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Buscar
                            </Button>
                            <Button
                                onClick={handleClearSearch}
                                variant="outline"
                                disabled={!searchTerm && !activeSearch}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpar
                            </Button>
                        </div>
                    </div>
                    
                    {/* Indicadores de filtros ativos */}
                    {(activeSearch || filtroAtivo !== 'all') && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {activeSearch && (
                                <Badge variant="secondary" className="gap-2">
                                    Busca: "{activeSearch}"
                                    <button
                                        onClick={() => setActiveSearch('')}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroAtivo !== 'all' && (
                                <Badge variant="secondary" className="gap-2">
                                    Status: {filtroAtivo === 'ativo' ? 'Ativos' : 'Inativos'}
                                    <button
                                        onClick={() => setFiltroAtivo('all')}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {servicosFiltrados.length} de {servicos.length} serviços
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            <HierarchicalAccordion
                servicos={servicosFiltrados}
                loading={loading}
                onAddServico={() => {
                    setServicoEditando(null);
                    setServicoFormOpen(true);
                }}
                onEditServico={(servico) => {
                    setServicoEditando(servico);
                    setServicoFormOpen(true);
                }}
                onDeleteServico={(servico) => {
                    setConfirmDelete({ type: 'servico', servico });
                }}
                onAddEtapa={(servico) => {
                    setServicoParaEtapa(servico);
                    setEtapaEditando(null);
                    setEtapaFormOpen(true);
                }}
                onEditEtapa={(servico, etapa) => {
                    setEtapaEditando({ servico, etapa });
                    setServicoParaEtapa(null);
                    setEtapaFormOpen(true);
                }}
                onDeleteEtapa={(servico, etapa) => {
                    setConfirmDelete({ type: 'etapa', servico, etapa });
                }}
                onAddTarefa={(servico, etapa) => {
                    setEtapaParaTarefa({ servico, etapa });
                    setTarefaEditando(null);
                    setTarefaFormOpen(true);
                }}
                onEditTarefa={(servico, etapa, tarefa) => {
                    setTarefaEditando({ servico, etapa, tarefa });
                    setEtapaParaTarefa(null);
                    setTarefaFormOpen(true);
                }}
                onDeleteTarefa={(servico, etapa, tarefa) => {
                    setConfirmDelete({ type: 'tarefa', servico, etapa, tarefa });
                }}
                onReorderServico={handleReorderServico}
                onReorderEtapa={handleReorderEtapa}
                onReorderTarefa={handleReorderTarefa}
            />

            {/* Formulário de Serviço */}
            <ServicoForm
                open={servicoFormOpen}
                onOpenChange={setServicoFormOpen}
                servico={servicoEditando}
                onSubmit={handleCreateServico}
                loading={submitting}
            />

            {/* Formulário de Etapa */}
            {servicoParaEtapa && (
                <EtapaForm
                    open={etapaFormOpen}
                    onOpenChange={(open) => {
                        setEtapaFormOpen(open);
                        if (!open) {
                            setServicoParaEtapa(null);
                            setEtapaEditando(null);
                        }
                    }}
                    servico={servicoParaEtapa}
                    etapa={etapaEditando?.etapa || null}
                    onSubmit={handleCreateEtapa}
                    loading={submitting}
                />
            )}

            {etapaEditando && !servicoParaEtapa && (
                <EtapaForm
                    open={etapaFormOpen}
                    onOpenChange={(open) => {
                        setEtapaFormOpen(open);
                        if (!open) {
                            setEtapaEditando(null);
                        }
                    }}
                    servico={etapaEditando.servico}
                    etapa={etapaEditando.etapa}
                    onSubmit={handleCreateEtapa}
                    loading={submitting}
                />
            )}

            {/* Formulário de Tarefa */}
            {etapaParaTarefa && (
                <TarefaForm
                    open={tarefaFormOpen}
                    onOpenChange={(open) => {
                        setTarefaFormOpen(open);
                        if (!open) {
                            setEtapaParaTarefa(null);
                            setTarefaEditando(null);
                        }
                    }}
                    servico={etapaParaTarefa.servico}
                    etapa={etapaParaTarefa.etapa}
                    tarefa={null}
                    onSubmit={handleCreateTarefa}
                    loading={submitting}
                />
            )}

            {tarefaEditando && !etapaParaTarefa && (
                <TarefaForm
                    open={tarefaFormOpen}
                    onOpenChange={(open) => {
                        setTarefaFormOpen(open);
                        if (!open) {
                            setTarefaEditando(null);
                        }
                    }}
                    servico={tarefaEditando.servico}
                    etapa={tarefaEditando.etapa}
                    tarefa={tarefaEditando.tarefa}
                    onSubmit={handleCreateTarefa}
                    loading={submitting}
                />
            )}

            {/* Diálogo de Confirmação de Exclusão */}
            {confirmDelete && (
                <ConfirmDialog
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setConfirmDelete(null);
                    }}
                    title={
                        confirmDelete.type === 'servico'
                            ? 'Excluir Serviço?'
                            : confirmDelete.type === 'etapa'
                            ? 'Excluir Etapa?'
                            : 'Excluir Tarefa?'
                    }
                    description={
                        confirmDelete.type === 'servico'
                            ? `Tem certeza que deseja excluir o serviço "${confirmDelete.servico.nome}"? Esta ação não pode ser desfeita.`
                            : confirmDelete.type === 'etapa'
                            ? `Tem certeza que deseja excluir a etapa "${confirmDelete.etapa?.nome || ''}"? Esta ação não pode ser desfeita.`
                            : `Tem certeza que deseja excluir a tarefa "${confirmDelete.tarefa?.nome || ''}"? Esta ação não pode ser desfeita.`
                    }
                    onConfirm={() => {
                        if (confirmDelete.type === 'servico') {
                            handleDeleteServico();
                        } else if (confirmDelete.type === 'etapa') {
                            handleDeleteEtapa();
                        } else if (confirmDelete.type === 'tarefa') {
                            handleDeleteTarefa();
                        }
                    }}
                />
            )}
        </div>
    );
}

