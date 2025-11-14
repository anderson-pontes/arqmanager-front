import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    FileText,
    DollarSign,
    Calendar,
    Settings,
    Building2,
    UserCog,
    Shield,
    Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
    className?: string;
}

const baseMenuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        title: 'Clientes',
        icon: Users,
        href: '/clientes',
    },
    {
        title: 'Projetos',
        icon: FolderKanban,
        href: '/projetos',
    },
    {
        title: 'Propostas',
        icon: FileText,
        href: '/propostas',
    },
    {
        title: 'Financeiro',
        icon: DollarSign,
        href: '/financeiro/contas',
    },
    {
        title: 'Calendário',
        icon: Calendar,
        href: '/calendario',
    },
    {
        title: 'Colaboradores',
        icon: UserCog,
        href: '/colaboradores',
    },
    {
        title: 'Escritório',
        icon: Building2,
        href: '/escritorio',
    },
    {
        title: 'Serviços',
        icon: Briefcase,
        href: '/servicos',
    },
    {
        title: 'Configurações',
        icon: Settings,
        href: '/configuracoes',
    },
];

const adminMenuItems = [
    {
        title: 'Administração',
        icon: Shield,
        href: '/admin',
    },
];

export function Sidebar({ className }: SidebarProps) {
    const { isSystemAdmin, isAdminMode } = useAuthStore();

    // Se estiver em modo administrativo, mostrar apenas menu de administração
    // Caso contrário, mostrar menus normais (com ou sem área admin dependendo do contexto)
    const menuItems = isAdminMode 
        ? adminMenuItems  // Apenas menu de administração
        : (isSystemAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems);  // Menus normais + admin se for system admin

    return (
        <aside
            className={cn(
                'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-300 bg-white backdrop-blur-md shadow-lg',
                className
            )}
        >
            <ScrollArea className="h-full py-4">
                <nav className="flex flex-col gap-1 px-3">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href!}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    'hover:bg-gray-100 hover:text-gray-800',
                                    isActive
                                        ? 'bg-violet-400 text-white'
                                        : 'text-gray-600'
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </NavLink>
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    );
}
