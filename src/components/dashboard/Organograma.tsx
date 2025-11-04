import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Tree from 'react-d3-tree';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { mockEscritorio, mockProjetos } from '@/data';

interface TreeNode {
    name: string;
    attributes?: {
        status?: string;
        cliente?: string;
        valor?: string;
        id?: number;
    };
    children?: TreeNode[];
}

export function Organograma() {
    const navigate = useNavigate();

    const treeData: TreeNode = useMemo(() => {
        const projetosAtivos = mockProjetos.filter((p) => p.status === 'Em Andamento');
        const projetosConcluidos = mockProjetos.filter((p) => p.status === 'Concluído');
        const projetosPausados = mockProjetos.filter((p) => p.status === 'Pausado');

        return {
            name: mockEscritorio.nomeFantasia,
            attributes: {
                status: 'Escritório',
            },
            children: [
                {
                    name: `Em Andamento (${projetosAtivos.length})`,
                    attributes: { status: 'Em Andamento' },
                    children: projetosAtivos.map((p) => ({
                        name: p.numero,
                        attributes: {
                            status: p.status,
                            cliente: p.cliente.nome,
                            valor: `R$ ${(p.valorContrato / 1000).toFixed(0)}k`,
                            id: p.id,
                        },
                    })),
                },
                {
                    name: `Concluídos (${projetosConcluidos.length})`,
                    attributes: { status: 'Concluído' },
                    children: projetosConcluidos.map((p) => ({
                        name: p.numero,
                        attributes: {
                            status: p.status,
                            cliente: p.cliente.nome,
                            valor: `R$ ${(p.valorContrato / 1000).toFixed(0)}k`,
                            id: p.id,
                        },
                    })),
                },
                ...(projetosPausados.length > 0
                    ? [
                        {
                            name: `Pausados (${projetosPausados.length})`,
                            attributes: { status: 'Pausado' },
                            children: projetosPausados.map((p) => ({
                                name: p.numero,
                                attributes: {
                                    status: p.status,
                                    cliente: p.cliente.nome,
                                    valor: `R$ ${(p.valorContrato / 1000).toFixed(0)}k`,
                                    id: p.id,
                                },
                            })),
                        },
                    ]
                    : []),
            ],
        };
    }, []);

    const renderCustomNode = ({ nodeDatum }: any) => {
        const isRoot = nodeDatum.name === mockEscritorio.nomeFantasia;
        const isCategory = nodeDatum.attributes?.status && !nodeDatum.attributes?.id;
        const isProject = nodeDatum.attributes?.id;

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'Em Andamento':
                    return '#3B82F6';
                case 'Concluído':
                    return '#10B981';
                case 'Pausado':
                    return '#F59E0B';
                default:
                    return '#8B5CF6';
            }
        };

        const handleClick = () => {
            if (isProject && nodeDatum.attributes?.id) {
                navigate(`/projetos/${nodeDatum.attributes.id}`);
            }
        };

        return (
            <g onClick={handleClick} style={{ cursor: isProject ? 'pointer' : 'default' }}>
                {isRoot && (
                    <>
                        <circle r={40} fill="#8B5CF6" />
                        <text fill="white" strokeWidth="0" x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold">
                            {nodeDatum.name.split(' ')[0]}
                        </text>
                        <text fill="white" strokeWidth="0" x="0" y="20" textAnchor="middle" fontSize="10">
                            {nodeDatum.name.split(' ').slice(1).join(' ')}
                        </text>
                    </>
                )}
                {isCategory && (
                    <>
                        <rect
                            x="-60"
                            y="-20"
                            width="120"
                            height="40"
                            fill={getStatusColor(nodeDatum.attributes.status)}
                            rx="8"
                        />
                        <text fill="white" strokeWidth="0" x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="bold">
                            {nodeDatum.name}
                        </text>
                    </>
                )}
                {isProject && (
                    <>
                        <rect
                            x="-70"
                            y="-35"
                            width="140"
                            height="70"
                            fill="white"
                            stroke={getStatusColor(nodeDatum.attributes.status)}
                            strokeWidth="2"
                            rx="6"
                        />
                        <text fill="#1F2937" strokeWidth="0" x="0" y="-15" textAnchor="middle" fontSize="12" fontWeight="bold">
                            {nodeDatum.name}
                        </text>
                        <text fill="#6B7280" strokeWidth="0" x="0" y="0" textAnchor="middle" fontSize="10">
                            {nodeDatum.attributes.cliente}
                        </text>
                        <text fill="#10B981" strokeWidth="0" x="0" y="15" textAnchor="middle" fontSize="11" fontWeight="600">
                            {nodeDatum.attributes.valor}
                        </text>
                    </>
                )}
            </g>
        );
    };

    return (
        <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle>Organograma de Projetos</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Badge className="bg-blue-500">Em Andamento</Badge>
                        <Badge className="bg-green-500">Concluído</Badge>
                        <Badge className="bg-yellow-500">Pausado</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: '600px' }}>
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: 400, y: 50 }}
                        nodeSize={{ x: 200, y: 150 }}
                        separation={{ siblings: 1.5, nonSiblings: 2 }}
                        renderCustomNodeElement={renderCustomNode}
                        zoom={0.8}
                        enableLegacyTransitions
                    />
                </div>
            </CardContent>
        </Card>
    );
}
