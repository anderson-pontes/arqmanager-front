// Validadores

export const isValidCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(10))) return false;

    return true;
};

export const isValidCNPJ = (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleaned)) return false;

    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
};

export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
};

export const isValidCEP = (cep: string): boolean => {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
};

export const isValidURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidDate = (date: string): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};

export const isValidPassword = (password: string): boolean => {
    // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
