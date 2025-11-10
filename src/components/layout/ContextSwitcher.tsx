import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, Settings, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function ContextSwitcher() {
    const navigate = useNavigate();
    const { user, currentContext, isSystemAdmin, isAdminMode, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);

    if (!user) {
        return null;
    }

    // Se estiver em modo admin, mostrar contexto administrativo
    if (isAdminMode) {
        const handleChangeContext = () => {
            navigate('/selecionar-contexto');
        };

        const handleLogout = () => {
            logout();
            navigate('/login');
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden md:inline">Área Administrativa</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Área Administrativa
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Gerenciamento do Sistema
                            </p>
                            <p className="text-xs leading-none text-primary font-semibold">
                                Admin do Sistema
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleChangeContext}>
                        <Settings className="mr-2 h-4 w-4" />
                        Trocar Contexto
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Modo escritório
    if (!currentContext.escritorioId) {
        return null;
    }

    const currentEscritorio = user.escritorios.find(
        (e) => e.escritorio.id === currentContext.escritorioId
    );

    const handleChangeContext = () => {
        navigate('/selecionar-contexto');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden md:inline">
                        {currentEscritorio?.escritorio.nomeFantasia || 'Escritório'}
                    </span>
                    {isSystemAdmin && (
                        <span className="hidden md:inline text-xs text-muted-foreground">
                            ({currentContext.perfil})
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {currentEscritorio?.escritorio.nomeFantasia}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            Perfil: {currentContext.perfil || currentEscritorio?.perfil}
                        </p>
                        {isSystemAdmin && (
                            <p className="text-xs leading-none text-primary font-semibold">
                                Admin do Sistema
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleChangeContext}>
                    <Settings className="mr-2 h-4 w-4" />
                    Trocar Escritório/Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

