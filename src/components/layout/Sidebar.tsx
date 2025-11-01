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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
    className?: string;
}

const menuItems = [
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
        href: '/financeiro',
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
        title: 'Configurações',
        icon: Settings,
        href: '/configuracoes',
    },
];

export function Sidebar({ className }: SidebarProps) {
    return (
        <aside
            className={cn(
                'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background',
                className
            )}
        >
            <ScrollArea className="h-full py-4">
                <nav className="flex flex-col gap-1 px-3">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    isActive
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground'
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
