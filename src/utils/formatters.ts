// Formatadores de dados

export const formatCurrency = (value: number): string => {
    try {
        if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value);
        }

        // Fallback manual
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `R$ ${value.toFixed(2)}`;
    }
};

export const formatDate = (date: string | Date): string => {
    if (!date) return '';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;

        // Verifica se a data é válida
        if (isNaN(d.getTime())) return date.toString();

        // Tenta usar Intl.DateFormat
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            return new Intl.DateTimeFormat('pt-BR').format(d);
        }

        // Fallback manual
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return date.toString();
    }
};

export const formatDateTime = (date: string | Date): string => {
    if (!date) return '';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;

        // Verifica se a data é válida
        if (isNaN(d.getTime())) return date.toString();

        // Tenta usar Intl.DateFormat
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            return new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
            }).format(d);
        }

        // Fallback manual
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return date.toString();
    }
};

export const formatCPF = (cpf: string | null | undefined): string => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCNPJ = (cnpj: string | null | undefined): string => {
    if (!cnpj) return '-';
    return cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
    );
};

export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
};

export const formatCEP = (cep: string): string => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};
