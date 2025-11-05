// Máscaras para inputs em tempo real

export const maskCPF = (value: string): string => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 segundos dígitos
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen após os 3 terceiros dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 11 dígitos
};

export const maskPhone = (value: string): string => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses no DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen após 5 dígitos (celular)
        .replace(/(-\d{4})\d+?$/, '$1'); // Limita em 11 dígitos
};

export const maskCEP = (value: string): string => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen após 5 dígitos
        .replace(/(-\d{3})\d+?$/, '$1'); // Limita em 8 dígitos
};

export const maskCNPJ = (value: string): string => {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{2})(\d)/, '$1.$2') // Coloca ponto após 2 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após 3 dígitos
        .replace(/(\d{3})(\d)/, '$1/$2') // Coloca barra após 3 dígitos
        .replace(/(\d{4})(\d)/, '$1-$2') // Coloca hífen após 4 dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 14 dígitos
};

export const unmask = (value: string): string => {
    return value.replace(/\D/g, ''); // Remove tudo que não é dígito
};
