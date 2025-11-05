import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { mockProjetos } from '@/data';
import { ProjetoTabs } from './components';

export function ProjetoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const projeto = mockProjetos.find((p) => p.id === Number(id));

    if (!projeto) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
                <Button onClick={() => navigate('/projetos')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Projetos
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Projeto ${projeto.numero}`}
                description={projeto.descricao}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/projetos')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/projetos/${id}/editar`)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </Button>
                    </div>
                }
            />

            <ProjetoTabs projeto={projeto} />
        </div>
    );
}
