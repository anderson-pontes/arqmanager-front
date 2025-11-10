import { Bell, Menu, Search, User, Building2, Settings, LogOut, Shield } from 'lucide-react';
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
import logoSemNome from '@/assets/logosemnome.png';

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, clearAuth, isAdminMode, currentContext, isSystemAdmin } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // ✅ Logout real com backend
            const { authService } = await import('@/api/services/auth.service');
            await authService.logout();
        } catch (error) {
            console.error('Erro ao fazer logout no backend:', error);
            // Continua com logout local mesmo se backend falhar
        } finally {
            // Limpa dados locais
            clearAuth();
            navigate('/login');
        }
    };

    const handleChangeContext = () => {
        navigate('/selecionar-contexto');
    };

    // Obter escritório atual
    const currentEscritorio = user?.escritorios.find(
        (e) => e.escritorio.id === currentContext?.escritorioId
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shadow-md">
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
                <div className="flex items-center shrink-0">
                    <img
                        src={logoSemNome}
                        alt="ARQManager"
                        className="h-16 w-16 object-contain"
                    />
                    <span className="hidden font-semibold sm:inline-block bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ARQManager
                    </span>
                </div>

                {/* Search - Centralizado (oculto em telas muito pequenas e em modo admin) */}
                {!isAdminMode && (
                    <div className="hidden md:flex flex-1 justify-center px-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar projetos, clientes..."
                                className="pl-8 w-full"
                            />
                        </div>
                    </div>
                )}
                
                {/* Espaçador quando em modo admin (para centralizar elementos à direita) */}
                {isAdminMode && <div className="flex-1" />}

                {/* Right Actions - Alinhado à direita */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    </Button>

                    {/* User Menu Integrado com Context Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-auto px-2 py-1.5 gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.foto} alt={user?.nome} />
                                    <AvatarFallback>
                                        {user ? getInitials(user.nome) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start text-left">
                                    <span className="text-sm font-medium leading-none">
                                        {user?.nome}
                                    </span>
                                    {isAdminMode ? (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Shield className="h-3 w-3" />
                                            Área Administrativa
                                        </span>
                                    ) : currentEscritorio ? (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Building2 className="h-3 w-3" />
                                            {currentEscritorio.escritorio.nomeFantasia}
                                        </span>
                                    ) : null}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="end" forceMount>
                            {/* Seção: Contexto/Escritório */}
                            {isAdminMode ? (
                                <>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <p className="text-sm font-medium leading-none">
                                                    Área Administrativa
                                                </p>
                                            </div>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                Gerenciamento do Sistema
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
                                        Trocar Contexto
                                    </DropdownMenuItem>
                                </>
                            ) : currentEscritorio ? (
                                <>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-primary" />
                                                <p className="text-sm font-medium leading-none">
                                                    {currentEscritorio.escritorio.nomeFantasia}
                                                </p>
                                            </div>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                Perfil: {currentContext?.perfil || currentEscritorio.perfil}
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
                                </>
                            ) : null}

                            {/* Seção: Usuário */}
                            <DropdownMenuSeparator />
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
                                <Settings className="mr-2 h-4 w-4" />
                                Configurações
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
