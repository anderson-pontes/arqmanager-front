// Utilitários de data
import {
    format,
    parseISO,
    differenceInDays,
    addDays,
    isWeekend,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (
    date: string | Date,
    pattern: string = 'dd/MM/yyyy'
): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern, { locale: ptBR });
};

export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatTime = (date: string | Date): string => {
    return formatDate(date, 'HH:mm');
};

export const formatRelativeDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    const days = differenceInDays(today, d);

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days === -1) return 'Amanhã';
    if (days > 0) return `Há ${days} dias`;
    return `Em ${Math.abs(days)} dias`;
};

export const calculateBusinessDays = (
    startDate: Date,
    days: number,
    holidays: Date[] = []
): Date => {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < days) {
        currentDate = addDays(currentDate, 1);

        // Verifica se não é fim de semana
        if (!isWeekend(currentDate)) {
            // Verifica se não é feriado
            const isHoliday = holidays.some(
                (holiday) =>
                    format(holiday, 'yyyy-MM-dd') ===
                    format(currentDate, 'yyyy-MM-dd')
            );

            if (!isHoliday) {
                addedDays++;
            }
        }
    }

    return currentDate;
};

export const calculateCalendarDays = (startDate: Date, days: number): Date => {
    return addDays(startDate, days);
};

export const getDaysUntil = (date: string | Date): number => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return differenceInDays(d, new Date());
};

export const isOverdue = (date: string | Date): boolean => {
    return getDaysUntil(date) < 0;
};

export const getMonthName = (month: number): string => {
    const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];
    return months[month];
};

export const getDayName = (day: number): string => {
    const days = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
    ];
    return days[day];
};
