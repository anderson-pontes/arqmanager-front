import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileText,
    Users,
    DollarSign,
    Calendar,
    Clock,
    Briefcase,
    FileCheck,
    ClipboardCheck,
} from 'lucide-react';
import { ProjetoResumo } from './ProjetoResumo';
import { ProjetoTimeline } from './ProjetoTimeline';
import { ProjetoReunioes } from './ProjetoReunioes';
import { ProjetoDocumentos } from './ProjetoDocumentos';
import { ProjetoPagamentos } from './ProjetoPagamentos';
import { ProjetoMicroservicos } from './ProjetoMicroservicos';
import { ProjetoRRTs } from './ProjetoRRTs';
import { ProjetoTermoEntrega } from './ProjetoTermoEntrega';
import type { Projeto } from '@/types';

interface ProjetoTabsProps {
    projeto: Projeto;
}

export function ProjetoTabs({ projeto }: ProjetoTabsProps) {
    return (
        <Tabs defaultValue="resumo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="resumo">
                    <FileText className="mr-2 h-4 w-4" />
                    Resumo
                </TabsTrigger>
                <TabsTrigger value="timeline">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                </TabsTrigger>
                <TabsTrigger value="reunioes">
                    <Users className="mr-2 h-4 w-4" />
                    Reuniões
                </TabsTrigger>
                <TabsTrigger value="documentos">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Documentos
                </TabsTrigger>
                <TabsTrigger value="pagamentos">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pagamentos
                </TabsTrigger>
                <TabsTrigger value="microservicos">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Microserviços
                </TabsTrigger>
                <TabsTrigger value="rrt">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    RRT
                </TabsTrigger>
                <TabsTrigger value="termo">
                    <Calendar className="mr-2 h-4 w-4" />
                    Termo
                </TabsTrigger>
            </TabsList>

            <TabsContent value="resumo">
                <ProjetoResumo projeto={projeto} />
            </TabsContent>

            <TabsContent value="timeline">
                <ProjetoTimeline projetoId={projeto.id} />
            </TabsContent>

            <TabsContent value="reunioes">
                <ProjetoReunioes projetoId={projeto.id} />
            </TabsContent>

            <TabsContent value="documentos">
                <ProjetoDocumentos projetoId={projeto.id} />
            </TabsContent>

            <TabsContent value="pagamentos">
                <ProjetoPagamentos projeto={projeto} />
            </TabsContent>

            <TabsContent value="microservicos">
                <ProjetoMicroservicos projetoId={projeto.id} />
            </TabsContent>

            <TabsContent value="rrt">
                <ProjetoRRTs projetoId={projeto.id} />
            </TabsContent>

            <TabsContent value="termo">
                <ProjetoTermoEntrega projetoId={projeto.id} />
            </TabsContent>
        </Tabs>
    );
}
