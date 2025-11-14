/**
 * Serviço para buscar informações de CEP via API pública (ViaCEP)
 */

export interface CEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string;
    erro?: boolean;
}

export const cepService = {
    /**
     * Busca informações de endereço pelo CEP
     * @param cep CEP no formato 00000000 ou 00000-000
     * @returns Dados do endereço ou null se não encontrado
     */
    async buscarCEP(cep: string): Promise<CEPResponse | null> {
        try {
            // Remove formatação do CEP
            const cepLimpo = cep.replace(/\D/g, '');
            
            if (cepLimpo.length !== 8) {
                return null;
            }
            
            // Buscar na API ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            
            if (!response.ok) {
                return null;
            }
            
            const data: CEPResponse = await response.json();
            
            // ViaCEP retorna { erro: true } quando não encontra
            if (data.erro) {
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            return null;
        }
    },
    
    /**
     * Formata CEP para exibição (00000-000)
     */
    formatCEP(cep: string): string {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return cep;
    },
};







