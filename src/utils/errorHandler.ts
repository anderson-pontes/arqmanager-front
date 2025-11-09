/**
 * Extrai mensagem de erro de uma resposta da API
 */
export function getErrorMessage(
    err: any,
    defaultMessage: string = 'Erro desconhecido'
): string {
    // Se já é uma string, retorna
    if (typeof err === 'string') {
        return err;
    }

    // Tenta pegar do response.data.detail
    if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        // Se detail é um array (erro de validação do FastAPI)
        if (Array.isArray(detail)) {
            return detail
                .map((e: any) => {
                    // Formato: "campo: mensagem"
                    const field = e.loc?.[e.loc.length - 1] || '';
                    const msg = e.msg || e.message || 'Erro de validação';
                    return field ? `${field}: ${msg}` : msg;
                })
                .join(', ');
        }

        // Se detail é uma string
        if (typeof detail === 'string') {
            return detail;
        }

        // Se detail é um objeto
        if (typeof detail === 'object') {
            return JSON.stringify(detail);
        }
    }

    // Tenta pegar mensagem genérica
    if (err.response?.data?.message) {
        return err.response.data.message;
    }

    // Tenta pegar do erro direto
    if (err.message) {
        return err.message;
    }

    return defaultMessage;
}
