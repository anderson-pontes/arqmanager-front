import { useParams } from 'react-router-dom';
import { DespesaForm } from '@/pages/financeiro/despesas/DespesaForm';

export function NovaDespesaContaPage() {
    const { id } = useParams();
    const contaId = Number(id);
    return <DespesaForm defaultContaId={Number.isFinite(contaId) ? contaId : undefined} />;
}


