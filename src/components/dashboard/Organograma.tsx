import { useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tree from 'react-d3-tree';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, FolderKanban, CheckCircle2, PauseCircle } from 'lucide-react';
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em Andamento':
                return '#A57CFA'; // violet-400
            case 'Concluído':
                return '#4ADE80'; // green-400
            case 'Pausado':
                return '#FBBF24'; // amber-400
            default:
                return '#A57CFA'; // violet-400
        }
    };

    const getStatusGradient = (status: string) => {
        switch (status) {
            case 'Em Andamento':
                return ['#A57CFA', '#8B5CF6']; // violet-400 to violet-500
            case 'Concluído':
                return ['#4ADE80', '#22C55E']; // green-400 to green-500
            case 'Pausado':
                return ['#FBBF24', '#F59E0B']; // amber-400 to amber-500
            default:
                return ['#A57CFA', '#8B5CF6'];
        }
    };

    const renderCustomNode = ({ nodeDatum, toggleNode }: { nodeDatum: TreeNode; toggleNode?: () => void }) => {
        const isRoot = nodeDatum.attributes?.status === 'Escritório';
        const isCategory = nodeDatum.attributes?.status && !nodeDatum.attributes?.id && !isRoot;
        const isProject = !!nodeDatum.attributes?.id;

        const handleClick = () => {
            if (isProject && nodeDatum.attributes?.id) {
                navigate(`/projetos/${nodeDatum.attributes.id}`);
            }
        };

        if (isRoot) {
            const gradientId = 'root-gradient';
            return (
                <g>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#A57CFA" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                        <filter id="shadow-root">
                            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
                        </filter>
                    </defs>
                    <rect
                        x="-120"
                        y="-50"
                        width="240"
                        height="100"
                        fill={`url(#${gradientId})`}
                        rx="16"
                        stroke="white"
                        strokeWidth="2"
                        filter="url(#shadow-root)"
                        className="transition-all duration-300 hover:scale-105"
                    />
                    <text
                        fill="white"
                        strokeWidth="0"
                        x="0"
                        y="-8"
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="700"
                        letterSpacing="0.5px"
                    >
                        {nodeDatum.name}
                    </text>
                    <text
                        fill="white"
                        strokeWidth="0"
                        x="0"
                        y="18"
                        textAnchor="middle"
                        fontSize="12"
                        opacity="0.95"
                        fontWeight="500"
                    >
                        Escritório de Arquitetura
                    </text>
                </g>
            );
        }

        if (isCategory && nodeDatum.attributes) {
            const status = nodeDatum.attributes.status || '';
            const gradientId = `category-gradient-${status}`;
            const [color1, color2] = getStatusGradient(status);

            return (
                <g>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color1} />
                            <stop offset="100%" stopColor={color2} />
                        </linearGradient>
                        <filter id={`shadow-category-${status}`}>
                            <feDropShadow dx="0" dy="3" stdDeviation="6" floodOpacity="0.25" />
                        </filter>
                    </defs>
                    <rect
                        x="-100"
                        y="-30"
                        width="200"
                        height="60"
                        fill={`url(#${gradientId})`}
                        rx="12"
                        stroke="white"
                        strokeWidth="2"
                        filter={`url(#shadow-category-${status})`}
                        className="transition-all duration-300 hover:scale-105"
                    />
                    <text
                        fill="white"
                        strokeWidth="0"
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        letterSpacing="0.3px"
                    >
                        {nodeDatum.name}
                    </text>
                </g>
            );
        }

        if (isProject && nodeDatum.attributes) {
            const status = nodeDatum.attributes.status || '';
            const statusColor = getStatusColor(status);
            const gradientId = `project-gradient-${nodeDatum.attributes.id}`;
            
            // Cores de fundo baseadas no status
            const getProjectBgColors = (status: string) => {
                switch (status) {
                    case 'Em Andamento':
                        return ['#F5F3FF', '#EDE9FE']; // violet-50 to violet-100
                    case 'Concluído':
                        return ['#F0FDF4', '#DCFCE7']; // green-50 to green-100
                    case 'Pausado':
                        return ['#FFFBEB', '#FEF3C7']; // amber-50 to amber-100
                    default:
                        return ['#FFFFFF', '#F5F5F7'];
                }
            };
            const [projectBg1, projectBg2] = getProjectBgColors(status);

            return (
                <g 
                    onClick={handleClick} 
                    style={{ cursor: 'pointer' }}
                    className="transition-all duration-300 hover:scale-105"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={projectBg1} />
                            <stop offset="100%" stopColor={projectBg2} />
                        </linearGradient>
                        <filter id={`shadow-project-${nodeDatum.attributes.id}`}>
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
                        </filter>
                    </defs>
                    {/* Card Background */}
                    <rect
                        x="-90"
                        y="-45"
                        width="180"
                        height="90"
                        fill={`url(#${gradientId})`}
                        stroke={statusColor}
                        strokeWidth="2.5"
                        rx="12"
                        filter={`url(#shadow-project-${nodeDatum.attributes.id})`}
                    />
                    {/* Status Indicator Bar */}
                    <rect
                        x="-90"
                        y="-45"
                        width="180"
                        height="4"
                        fill={statusColor}
                        rx="12"
                    />
                    {/* Project Number */}
                    <text
                        fill="#2E2E38"
                        strokeWidth="0"
                        x="0"
                        y="-22"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        letterSpacing="0.5px"
                    >
                        {nodeDatum.name}
                    </text>
                    {/* Client Name */}
                    <text
                        fill="#6B7280"
                        strokeWidth="0"
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                    >
                        {nodeDatum.attributes.cliente}
                    </text>
                    {/* Value */}
                    <text
                        fill={statusColor}
                        strokeWidth="0"
                        x="0"
                        y="18"
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                    >
                        {nodeDatum.attributes.valor}
                    </text>
                </g>
            );
        }

        return <g />;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Adiciona estilos CSS customizados para as linhas do organograma
        const style = document.createElement('style');
        style.textContent = `
            .link-custom {
                fill: none;
                stroke: #D1D5DB;
                stroke-width: 2.5;
                stroke-dasharray: 0;
                transition: stroke 0.3s ease;
            }
            .link-custom:hover {
                stroke: #A57CFA;
                stroke-width: 3;
            }
            .rd3t-node {
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <Card className="bg-white border-gray-300 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-50">
                            <Building2 className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <CardTitle className="text-gray-800">Organograma de Projetos</CardTitle>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Visualização hierárquica dos projetos do escritório
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="default" className="bg-violet-400 hover:bg-violet-500">
                            <FolderKanban className="h-3 w-3 mr-1" />
                            Em Andamento
                        </Badge>
                        <Badge className="bg-green-400 hover:bg-green-500 text-white">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Concluído
                        </Badge>
                        <Badge className="bg-amber-400 hover:bg-amber-500 text-white">
                            <PauseCircle className="h-3 w-3 mr-1" />
                            Pausado
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div 
                    ref={containerRef}
                    style={{ 
                        width: '100%', 
                        height: '750px',
                        backgroundColor: '#F5F5F7',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                    className="border border-gray-200"
                >
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: containerRef.current?.clientWidth ? containerRef.current.clientWidth / 2 : 600, y: 80 }}
                        nodeSize={{ x: 280, y: 220 }}
                        separation={{ siblings: 1.8, nonSiblings: 2.2 }}
                        renderCustomNodeElement={renderCustomNode}
                        zoom={0.8}
                        scaleExtent={{ min: 0.3, max: 2.5 }}
                        pathClassFunc={() => 'link-custom'}
                        depthFactor={220}
                        enableLegacyTransitions={true}
                        transitionDuration={300}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
