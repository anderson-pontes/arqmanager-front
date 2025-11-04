import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { mockEventos, mockFeriados, mockProjetos } from '@/data';
import { formatDate } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export function CalendarioView() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProject, setSelectedProject] = useState<string>('todos');
    const [showFeriados, setShowFeriados] = useState(true);
    const [showEventos, setShowEventos] = useState(true);

    // Navegação de mês
    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const today = () => {
        setCurrentDate(new Date());
    };

    // Obter dias do mês
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
            });
        }

        // Dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }

        // Dias do próximo mês
        const remainingDays = 42 - days.length; // 6 semanas * 7 dias
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    };

    // Filtrar eventos por projeto
    const filteredEventos = useMemo(() => {
        if (selectedProject === 'todos') return mockEventos;
        return mockEventos.filter((e) => e.projeto?.numero === selectedProject);
    }, [selectedProject]);

    // Obter eventos de um dia específico
    const getEventsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const events = [];

        if (showEventos) {
            const dayEvents = filteredEventos.filter((e) => e.dataInicio === dateStr);
            events.push(...dayEvents);
        }

        if (showFeriados) {
            const dayFeriados = mockFeriados.filter((f) => f.data === dateStr);
            events.push(...dayFeriados.map((f) => ({ ...f, tipo: 'Feriado' })));
        }

        return events;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    // Lista de projetos para o filtro
    const projetos = mockProjetos || [];

    return (
        <div>
            <PageHeader
                title="Calendário"
                description="Visualize prazos, eventos e feriados"
                action={
                    <Button variant="outline" onClick={() => navigate('/calendario/feriados')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Gerenciar Feriados
                    </Button>
                }
            />

            {/* Controles do Calendário */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Navegação */}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={previousMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={today}>
                                Hoje
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <h2 className="text-xl font-semibold ml-4 capitalize">{monthName}</h2>
                        </div>

                        {/* Filtros */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showEventos"
                                    checked={showEventos}
                                    onChange={(e) => setShowEventos(e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="showEventos" className="text-sm">Eventos</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showFeriados"
                                    checked={showFeriados}
                                    onChange={(e) => setShowFeriados(e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="showFeriados" className="text-sm">Feriados</label>
                            </div>
                            <Select value={selectedProject} onValueChange={setSelectedProject}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filtrar por projeto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Projetos</SelectItem>
                                    {projetos.map((projeto) => (
                                        <SelectItem key={projeto.numero} value={projeto.numero}>
                                            {projeto.numero} - {projeto.cliente.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendário */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg">
                <CardContent className="p-4">
                    {/* Cabeçalho dos dias da semana */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grade de dias */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => {
                            const events = getEventsForDay(day.date);
                            const isCurrentDay = isToday(day.date);

                            return (
                                <div
                                    key={index}
                                    className={`
                                        min-h-[120px] p-2 border rounded-lg transition-colors
                                        ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                                        ${isCurrentDay ? 'border-primary border-2' : 'border-gray-200'}
                                        hover:bg-accent/50 cursor-pointer
                                    `}
                                >
                                    <div className={`
                                        text-sm font-medium mb-1
                                        ${!day.isCurrentMonth ? 'text-muted-foreground' : ''}
                                        ${isCurrentDay ? 'text-primary font-bold' : ''}
                                    `}>
                                        {day.date.getDate()}
                                    </div>

                                    {/* Eventos do dia */}
                                    <div className="space-y-1">
                                        {events.slice(0, 3).map((event: any, idx) => (
                                            <div
                                                key={idx}
                                                className="text-xs p-1 rounded truncate"
                                                style={{
                                                    backgroundColor: event.cor + '20',
                                                    borderLeft: `3px solid ${event.cor}`,
                                                }}
                                                title={event.titulo || event.nome}
                                            >
                                                {event.horaInicio && (
                                                    <span className="font-semibold">{event.horaInicio} </span>
                                                )}
                                                {event.titulo || event.nome}
                                            </div>
                                        ))}
                                        {events.length > 3 && (
                                            <div className="text-xs text-muted-foreground pl-1">
                                                +{events.length - 3} mais
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Legenda */}
            <Card className="backdrop-blur-sm bg-white/80 border-purple-100/50 shadow-lg mt-6">
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Legenda</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                            <span className="text-sm">Entrega</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
                            <span className="text-sm">Reunião</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                            <span className="text-sm">Prazo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC3545' }}></div>
                            <span className="text-sm">Feriado</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
