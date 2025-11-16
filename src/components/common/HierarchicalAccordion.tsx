import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import type { Servico, Etapa, Tarefa } from '@/types';

interface HierarchicalAccordionProps {
    servicos: Servico[];
    onAddServico?: () => void;
    onEditServico?: (servico: Servico) => void;
    onDeleteServico?: (servico: Servico) => void;
    onReorderServico?: (servicoId: number, direction: 'up' | 'down') => void;
    onAddEtapa?: (servico: Servico) => void;
    onEditEtapa?: (servico: Servico, etapa: Etapa) => void;
    onDeleteEtapa?: (servico: Servico, etapa: Etapa) => void;
    onReorderEtapa?: (servicoId: number, etapaId: number, direction: 'up' | 'down') => void;
    onAddTarefa?: (servico: Servico, etapa: Etapa) => void;
    onEditTarefa?: (servico: Servico, etapa: Etapa, tarefa: Tarefa) => void;
    onDeleteTarefa?: (servico: Servico, etapa: Etapa, tarefa: Tarefa) => void;
    onReorderTarefa?: (servicoId: number, etapaId: number, tarefaId: number, direction: 'up' | 'down') => void;
    loading?: boolean;
}

export function HierarchicalAccordion({
    servicos,
    onAddServico,
    onEditServico,
    onDeleteServico,
    onAddEtapa,
    onEditEtapa,
    onDeleteEtapa,
    onReorderEtapa,
    onAddTarefa,
    onEditTarefa,
    onDeleteTarefa,
    onReorderTarefa,
    loading = false,
}: HierarchicalAccordionProps) {
    const [expandedServicos, setExpandedServicos] = useState<Set<number>>(new Set());
    const [expandedEtapas, setExpandedEtapas] = useState<Set<string>>(new Set());

    const toggleServico = (servicoId: number) => {
        const newExpanded = new Set(expandedServicos);
        if (newExpanded.has(servicoId)) {
            newExpanded.delete(servicoId);
        } else {
            newExpanded.add(servicoId);
        }
        setExpandedServicos(newExpanded);
    };

    const toggleEtapa = (servicoId: number, etapaId: number) => {
        const key = `${servicoId}-${etapaId}`;
        const newExpanded = new Set(expandedEtapas);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedEtapas(newExpanded);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (servicos.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                    Nenhum serviço cadastrado
                </p>
                {onAddServico && (
                    <Button onClick={onAddServico} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Primeiro Serviço
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {servicos.map((servico) => {
                const isServicoExpanded = expandedServicos.has(servico.id);
                const etapas = servico.etapas || [];

                return (
                    <div
                        key={servico.id}
                        className="border rounded-lg overflow-hidden bg-card"
                    >
                        {/* Cabeçalho do Serviço */}
                        <Collapsible
                            open={isServicoExpanded}
                            onOpenChange={() => toggleServico(servico.id)}
                        >
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center gap-2 flex-1 cursor-pointer">
                                        {isServicoExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold text-base">
                                                {servico.nome}
                                            </h3>
                                            {servico.descricao && (
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {servico.descricao}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {servico.codigo_plano_contas && (
                                                <Badge variant="outline">
                                                    {servico.codigo_plano_contas}
                                                </Badge>
                                            )}
                                            {!servico.ativo && (
                                                <Badge variant="secondary">Inativo</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <div className="flex items-center gap-2 ml-4">
                                    {onEditServico && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditServico(servico);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDeleteServico && etapas.length === 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteServico(servico);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                    {onAddEtapa && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddEtapa(servico);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Etapa
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Conteúdo do Serviço - Etapas */}
                            <CollapsibleContent>
                                <div className="border-t bg-muted/30">
                                    {etapas.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Nenhuma etapa cadastrada
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {etapas.map((etapa) => {
                                                const key = `${servico.id}-${etapa.id}`;
                                                const isEtapaExpanded = expandedEtapas.has(key);
                                                const tarefas = etapa.tarefas || [];

                                                return (
                                                    <div key={etapa.id} className="bg-background">
                                                        {/* Cabeçalho da Etapa */}
                                                        <Collapsible
                                                            open={isEtapaExpanded}
                                                            onOpenChange={() =>
                                                                toggleEtapa(servico.id, etapa.id)
                                                            }
                                                        >
                                                            <div className="flex items-center justify-between p-3 pl-8 hover:bg-muted/50 transition-colors">
                                                                <CollapsibleTrigger asChild>
                                                                    <div className="flex items-center gap-2 flex-1 cursor-pointer">
                                                                        {isEtapaExpanded ? (
                                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                        ) : (
                                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                        )}
                                                                        <div className="flex-1 text-left">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-sm">
                                                                                    {etapa.nome}
                                                                                </span>
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="text-xs"
                                                                                >
                                                                                    Ordem: {etapa.ordem}
                                                                                </Badge>
                                                                                {!etapa.obrigatoria && (
                                                                                    <Badge
                                                                                        variant="secondary"
                                                                                        className="text-xs"
                                                                                    >
                                                                                        Opcional
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                            {etapa.descricao && (
                                                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                                                    {etapa.descricao}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </CollapsibleTrigger>
                                                                <div className="flex items-center gap-2 ml-4">
                                                                    {onReorderEtapa && (
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-3 p-0"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    onReorderEtapa(servico.id, etapa.id, 'up');
                                                                                }}
                                                                                disabled={etapas.indexOf(etapa) === 0}
                                                                            >
                                                                                <ArrowUp className="h-2.5 w-2.5" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-3 p-0"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    onReorderEtapa(servico.id, etapa.id, 'down');
                                                                                }}
                                                                                disabled={etapas.indexOf(etapa) === etapas.length - 1}
                                                                            >
                                                                                <ArrowDown className="h-2.5 w-2.5" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    {onEditEtapa && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onEditEtapa(servico, etapa);
                                                                            }}
                                                                        >
                                                                            <Edit className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                                    {onDeleteEtapa && tarefas.length === 0 && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onDeleteEtapa(servico, etapa);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="h-3 w-3 text-destructive" />
                                                                        </Button>
                                                                    )}
                                                                    {onAddTarefa && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onAddTarefa(servico, etapa);
                                                                            }}
                                                                        >
                                                                            <Plus className="h-3 w-3 mr-1" />
                                                                            Tarefa
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Conteúdo da Etapa - Tarefas */}
                                                            <CollapsibleContent>
                                                                <div className="bg-muted/20">
                                                                    {tarefas.length === 0 ? (
                                                                        <div className="p-3 pl-12 text-center text-xs text-muted-foreground">
                                                                            Nenhuma tarefa cadastrada
                                                                        </div>
                                                                    ) : (
                                                                        <div className="divide-y">
                                                                            {tarefas.map((tarefa) => (
                                                                                <div
                                                                                    key={tarefa.id}
                                                                                    className="flex items-center justify-between p-2 pl-12 hover:bg-muted/30 transition-colors"
                                                                                >
                                                                                    <div className="flex items-center gap-2 flex-1">
                                                                                        {tarefa.cor && (
                                                                                            <div
                                                                                                className="w-3 h-3 rounded-full shrink-0"
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        tarefa.cor,
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                        <span className="text-sm">
                                                                                            {tarefa.nome}
                                                                                        </span>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <Badge
                                                                                                variant="outline"
                                                                                                className="text-xs"
                                                                                            >
                                                                                                #{tarefa.ordem}
                                                                                            </Badge>
                                                                                            {tarefa.tem_prazo && (
                                                                                                <Badge
                                                                                                    variant="secondary"
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    Prazo
                                                                                                </Badge>
                                                                                            )}
                                                                                            {tarefa.precisa_detalhamento && (
                                                                                                <Badge
                                                                                                    variant="secondary"
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    Detalhe
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        {onReorderTarefa && (
                                                                                            <div className="flex flex-col gap-0.5 mr-1">
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-3 p-0"
                                                                                                    onClick={() =>
                                                                                                        onReorderTarefa(
                                                                                                            servico.id,
                                                                                                            etapa.id,
                                                                                                            tarefa.id,
                                                                                                            'up'
                                                                                                        )
                                                                                                    }
                                                                                                    disabled={tarefas.indexOf(tarefa) === 0}
                                                                                                >
                                                                                                    <ArrowUp className="h-2 w-2" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-3 p-0"
                                                                                                    onClick={() =>
                                                                                                        onReorderTarefa(
                                                                                                            servico.id,
                                                                                                            etapa.id,
                                                                                                            tarefa.id,
                                                                                                            'down'
                                                                                                        )
                                                                                                    }
                                                                                                    disabled={tarefas.indexOf(tarefa) === tarefas.length - 1}
                                                                                                >
                                                                                                    <ArrowDown className="h-2 w-2" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        )}
                                                                                        {onEditTarefa && (
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                    onEditTarefa(
                                                                                                        servico,
                                                                                                        etapa,
                                                                                                        tarefa
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <Edit className="h-3 w-3" />
                                                                                            </Button>
                                                                                        )}
                                                                                        {onDeleteTarefa && (
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                    onDeleteTarefa(
                                                                                                        servico,
                                                                                                        etapa,
                                                                                                        tarefa
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <Trash2 className="h-3 w-3 text-destructive" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                );
            })}
        </div>
    );
}

