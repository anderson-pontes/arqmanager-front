import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function EscritorioSwitcher() {
    const navigate = useNavigate();
    const { user, setEscritorioAtual } = useAuthStore();
    const [isChanging, setIsChanging] = useState(false);

    if (!user || !user.escritorioAtual) {
        return null;
    }

    const handleChangeEscritorio = async (escritorioId: number) => {
        if (escritorioId === user.escritorioId) return;

        setIsChanging(true);

        const escritorio = user.escritorios.find((e) => e.escritorio.id === escritorioId);

        if (!escritorio) {
            toast.error('Escritório não encontrado');
            setIsChanging(false);
            return;
        }

        // Simula delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            setEscritorioAtual(escritorio);
            toast.success(`Escritório alterado para: ${escritorio.escritorio.nomeFantasia}`);

            // Recarrega a página para atualizar os dados
            window.location.reload();
        } catch (error) {
            toast.error('Erro ao trocar de escritório');
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isChanging}>
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: user.escritorioAtual.cor }}
                    />
                    <Building2 className="h-4 w-4" />
                    <span className="hidden md:inline">{user.escritorioAtual.nomeFantasia}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>Escritórios</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.escritorios.map((userEscritorio) => (
                    <DropdownMenuItem
                        key={userEscritorio.id}
                        onClick={() => handleChangeEscritorio(userEscritorio.escritorio.id)}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: userEscritorio.escritorio.cor }}
                                />
                                <div>
                                    <p className="font-medium">
                                        {userEscritorio.escritorio.nomeFantasia}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {userEscritorio.perfil}
                                    </p>
                                </div>
                            </div>
                            {user.escritorioId === userEscritorio.escritorio.id && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/selecionar-escritorio')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Ver Todos os Escritórios
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
