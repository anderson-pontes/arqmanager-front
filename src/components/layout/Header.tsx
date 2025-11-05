import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formatters';
import { EscritorioSwitcher } from './EscritorioSwitcher';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-200 bg-linear-to-r from-purple-50 to-white backdrop-blur-md shadow-md">
            <div className="flex h-14 items-center gap-4 px-4">
                {/* Menu Button (Mobile) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Logo */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        ARQ
                    </div>
                    <span className="hidden font-semibold sm:inline-block">
                        ARQManager
                    </span>
                </div>

                {/* Search - Centralizado */}
                <div className="flex-1 flex justify-center px-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar projetos, clientes..."
                            className="pl-8 w-full"
                        />
                    </div>
                </div>

                {/* Right Actions - Alinhado à direita */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Escritório Switcher */}
                    <EscritorioSwitcher />

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.foto} alt={user?.nome} />
                                    <AvatarFallback>
                                        {user ? getInitials(user.nome) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.nome}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/perfil')}>
                                <User className="mr-2 h-4 w-4" />
                                Meu Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                                Configurações
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
