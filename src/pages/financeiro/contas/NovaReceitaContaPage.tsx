import { useParams } from 'react-router-dom';
import { ReceitaForm } from '@/pages/financeiro/receitas/ReceitaForm';

export function NovaReceitaContaPage() {
    const { id } = useParams();
    const contaId = Number(id);
    return <ReceitaForm defaultContaId={Number.isFinite(contaId) ? contaId : undefined} />;
}


